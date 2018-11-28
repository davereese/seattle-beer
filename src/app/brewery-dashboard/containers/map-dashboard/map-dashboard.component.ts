import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/map';

import { Brewery } from '../../models/brewery.interface';

interface marker {
  lat: number,
  lng: number,
  name?: string,
  address?: string,
  city?: string,
  zip?: number,
  url?: string,
  tags?: Array<string>,
  icon: {},
  openInfoWindow?: boolean,
  key?: number,
  visited?: boolean,
}

@Component({
  selector: 'app-map-dashboard',
  styleUrls: ['map-dashboard.component.scss'],
  template: `
  <div class="loader" *ngIf="isLoading">
    <div class="loader__bar"></div><div class="loader__bar"></div><div class="loader__bar"></div>
  </div>
  <div class="visited-filters" *ngIf="loggedIn && !single">
    <div>
      <input
        type="checkbox"
        name="visited"
        id="visited"
        [(ngModel)]="visited"
        (click)="handleVisitClick($event.target.id)"
      />
      <label for="visited" class="checkbox">Visited</label>
    </div>
    <div>
      <input
        type="checkbox"
        name="unvisited"
        id="unvisited"
        [(ngModel)]="unvisited"
        (click)="handleVisitClick($event.target.id)"
      />
      <label for="unvisited" class="checkbox">Unvisited</label>
    </div>
  </div>
  <agm-map
    #gm
    [latitude]="lat"
    [longitude]="lng"
    [zoom]="zoom"
    [styles]="style"
    [streetViewControl]="streetView"
    [scrollwheel]="scrollwheel"
    class="map-container"
  >
    <agm-marker
      *ngFor="let marker of markers; let i = index"
      [latitude]="marker.lat"
      [longitude]="marker.lng"
      [iconUrl]="marker.icon"
      [visible]="visitedFilter === marker.visited || visitedFilter === null || marker.name === 'geolocation'"
      [openInfoWindow]="marker.openInfoWindow"
      (markerClick)="selectMarker(marker)"
    ></agm-marker>
    <agm-info-window
      class="brewery-info"
      [latitude]="infoContent.lat"
      [longitude]="infoContent.lng"
      [isOpen]="infoOpen"
      [disableAutoPan]="false"
      #infoWindow
    >
      <button
        type="button"
        title="Close Window"
        class="close"
        (click)="closeInfoWindow()"
      >X</button>
      <h3>{{ infoContent.name }}</h3>
      <p>{{ infoContent.address }}<br>
      {{ infoContent.city }} WA, {{ infoContent.zip }}</p>
      <tag *ngFor="let tag of infoContent.tags" [tag]="tag"></tag>
      <p class="brewery-detail__meta"><a href="{{ infoContent.url }}" target="_blank">Website</a> | <a href="https://www.google.com/maps/dir/{{infoContent.address}},{{infoContent.city}},WA,{{infoContent.zip}}" target="_blank">Directions</a></p>
      <div class="visited-toggles" *ngIf="loggedIn">
        <button
          *ngIf="!infoContent.visited"
          type="button"
          class="brewery-detail__button button-check-in"
          (click)="handleCheckIn(infoContent.key)"
        >Check In</button>
        <button
          *ngIf="infoContent.visited"
          type="button"
          class="brewery-detail__button button-reset"
          (click)="handleReset(infoContent.key)"
        >Reset</button>
      </div>
    </agm-info-window>
  </agm-map>
  `
})
export class MapDashboardComponent implements OnInit {
  previous_info_window = null;
  public infoOpen: boolean = false;
  public emptyInfoContent = {
    lat: null,
    lng: null,
    name: null,
    address: null,
    city: null,
    zip: null,
    url: null,
    tags: [],
    visited: null,
    key: null,
  };
  public infoContent = this.emptyInfoContent;
  isLoading: boolean = true;
  single: boolean = false;
  lat: number = 47.6062;
  lng: number = -122.3321;
  zoom: number = 12;
  streetView: boolean = false;
  scrollwheel: boolean = false;
  breweries: Brewery[];
  data = [];
  markers: marker[] = [];
  style = [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#444444"}]},{"featureType":"all","elementType":"labels","stylers":[{"color":"#373737"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#7f7f7f"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"color":"#252525"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#81ac54"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#383838"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#383838"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#646464"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#252525"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}];

  public loggedIn: boolean = false;
  public visited: boolean = false;
  public unvisited: boolean = false;
  public visitedFilter: boolean = null;

  private urlParam: number;
  private visitList: AngularFireList<any[]> = null;
  private breweriesObservable: Observable<any[]>;
  private userVisitsObservable: Observable<any[]>;
  private breweriesSubscription: Subscription;
  private visitsSubscription: Subscription;
  private userId: string;
  private _infoWindows;

  constructor(
    private route: ActivatedRoute,
    af: AngularFireDatabase
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.urlParam = params['id'];
        this.single = true;
        this.breweriesObservable = af.list('/Breweries/'+params['id']).valueChanges();
      } else {
        this.breweriesObservable = af.list('/Breweries').snapshotChanges().pipe(
          map(actions =>
            actions.map(a => ({ key: a.key, visited: null, ...a.payload.val() }))
          )
        );
      }
    });

    this.userId = sessionStorage.getItem('uid');

    if (this.userId) {
      // if logged in
      this.loggedIn = true;

      // set fire list
      this.visitList = af.list(`Visits/${this.userId}`);

      // query observable
      this.userVisitsObservable = af.list(`Visits/${this.userId}`).snapshotChanges().pipe(
          map(actions =>
            actions.map(a => ({ key: a.key, ...a.payload.val() }))
          )
        );

      const combinedList = combineLatest([this.breweriesObservable, this.userVisitsObservable]);

      this.visitsSubscription = combinedList.subscribe(val => {
          if ( 'string' !== typeof(val[0][0])) {
            val[0].map((brewery) => {
              // check to see if the berewery's key is in the userVisits array
              const brewerykey = brewery.key;
              brewery.visited = val[1].some(index => index.key === brewerykey );
              this.data.push(brewery);
            });
          } else {
            if (this.single) {
              val[0][9] = val[1].some(index => index.key === this.urlParam );
              val[0][10] = this.urlParam;
            }
            this.data.push(val[0]);
          }
          this.pushMarkers();
          this.isLoading = false;
        });
    } else {
      // if not logged in
      this.breweriesSubscription = this.breweriesObservable.subscribe(complete => {
          complete.forEach(snapshot => {
            this.data.push(snapshot);
          });
          this.pushMarkers();
          this.isLoading = false;
        });
    }
  }

  ngOnInit() {
    if ("geolocation" in navigator && !this.single) {
      navigator.geolocation.getCurrentPosition((position) => {
        window.setTimeout(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.pushCenterMarker();
        }, 1000);
      });
    }
  }

  public selectMarker(marker) {
    if (marker.openInfoWindow === true) {
      this.infoOpen = true;
      this.infoContent = marker;
    }
  }

  public closeInfoWindow() {
    this.infoOpen = false;
    this.infoContent = this.emptyInfoContent;
  }

  private getIconColor(test: boolean): string {
    if (test === true) {
      return '../assets/images/marker2-1-visited-2.svg';
    } else {
      return '../assets/images/marker2-1.svg';
    }
  }

  private pushMarkers() {
    // Single location
    if ( 'string' === typeof(this.data[0][0])) {
      const tags: Array<string> = this.data[0][6].length > 0 ? this.data[0][6].split(",") : null;
      let icon: string = this.getIconColor(this.data[0][9]);
      this.markers.push({
        lat: Number(this.data[0][2]),
        lng: Number(this.data[0][3]),
        name: this.data[0][4],
        address: this.data[0][0],
        city: this.data[0][1],
        zip: this.data[0][8],
        tags: tags,
        url: this.data[0][7],
        openInfoWindow: true,
        visited: this.data[0][9],
        key: this.data[0][10],
        icon: {
          url: icon,
          scaledSize: {width: 24, height: 30},
          anchor: {x: 12, y: 30}
        }
      });
      // center map on marker
      this.lat = Number(this.data[0][2]);
      this.lng = Number(this.data[0][3]);
    // All locations
    } else {
      this.data.forEach(element => {
        // if brewery has a lat and long, add it to the map
        if (element.latitude && element.longitude) {
          const tags: Array<string> = element.tags.length > 0 ? element.tags.split(",") : null;
          let icon: string = this.getIconColor(element.visited);
          this.markers.push({
            lat: Number(element.latitude),
            lng: Number(element.longitude),
            name: element.name,
            address: element.address,
            city: element.city,
            zip: element.zip,
            tags: tags,
            url: element.url,
            openInfoWindow: true,
            visited: element.visited,
            key: element.key,
            icon: {
              url: icon,
              scaledSize: {width: 24, height: 30},
              anchor: {x: 12, y: 30}
            }
          });
        }
      });
    }
  }

  private pushCenterMarker() {
    this.markers.push({
      lat: Number(this.lat),
      lng: Number(this.lng),
      name: 'geolocation',
      icon: {
        url: '../assets/images/location_marker.svg',
        size: {width: 24, height: 24},
        scaledSize: {width: 24, height: 24},
        anchor: {x: 12, y: 24},
      },
      openInfoWindow: false,
    });
  }

  private removeMarker(value) {
    const markerPos = this.markers.map((x) => x.key ).indexOf(value);
    this.markers.splice(markerPos);
  }

  public handleVisitClick(target) {
    this.closeInfoWindow();
    if (target === 'visited') {
      this.unvisited = false;
      this.visitedFilter = this.visited === false ? true : null;
    } else if (target === 'unvisited') {
      this.visited = false;
      this.visitedFilter = this.unvisited === false ? false : null;
    }
  }

  public handleCheckIn(key) {
    this.removeMarker(key);
    // @ts-ignore
    this.visitList.update(key, {0: true});
    this.infoContent.visited = true;
  }

  public handleReset(key) {
    this.removeMarker(key);
    this.visitList.remove(key);
    this.infoContent.visited = false;
  }

  ngOnDestroy() {
    if (this.breweriesSubscription) {
      this.breweriesSubscription.unsubscribe();
    }

    if (this.visitsSubscription) {
      this.visitsSubscription.unsubscribe();
    }
  }
}
