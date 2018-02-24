import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Brewery } from '../../models/brewery.interface';

interface marker {
	lat: number,
	lng: number,
  name?: string,
  address?: string,
  city?: string,
  zip?: number,
  url?: string,
  icon?: {},
  openInfoWindow?: boolean,
}

@Component({
  selector: 'app-map-dashboard',
  styleUrls: ['map-dashboard.component.scss'],
  template: `
  <div class="loader" *ngIf="isLoading">
    <div class="loader__bar"></div><div class="loader__bar"></div><div class="loader__bar"></div>
  </div>
  <sebm-google-map
    #gm
    [latitude]="lat"
    [longitude]="lng"
    [zoom]="zoom"
    [styles]="style"
    [streetViewControl]="streetView"
    [scrollwheel]="scrollwheel"
    class="map-container">

    <sebm-google-map-marker
      *ngFor="let marker of markers; let i = index"
      [latitude]="marker.lat"
      [longitude]="marker.lng"
      [iconUrl]="marker.icon ? marker.icon : icon"
      [openInfoWindow]="marker.openInfoWindow"
      (markerClick)="gm.lastOpen?.close(); gm.lastOpen = infoWindow">

      <sebm-google-map-info-window
        class="brewery-info"
        #infoWindow>
        <h3>{{ marker.name }}</h3>
        <p>{{ marker.address }}<br>
        {{ marker.city }} WA, {{ marker.zip }}</p>
        <p class="brewery-detail__meta"><a href="{{ marker.url }}" target="_blank">Website</a> | <a href="https://www.google.com/maps/dir/{{marker.address}},{{marker.city}},WA,{{marker.zip}}" target="_blank">Directions</a></p>
      </sebm-google-map-info-window>

    </sebm-google-map-marker>
  </sebm-google-map>
  `
})
export class MapDashboardComponent implements OnInit {
  isLoading: boolean = true;
  lat: number = 47.6062;
  lng: number = -122.3321;
  zoom: number = 12;
  streetView: boolean = false;
  scrollwheel: boolean = false;
  breweries: FirebaseListObservable<any>;
  data = [];
  markers: marker[] = [];
  icon = {
    url: '../assets/images/marker2-1.svg',
    scaledSize: {width: 24, height: 30},
    anchor: {x: 12, y: 30}
  };
  style = [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#444444"}]},{"featureType":"all","elementType":"labels","stylers":[{"color":"#373737"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#7f7f7f"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"color":"#252525"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#81ac54"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#383838"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#383838"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#646464"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#252525"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    af: AngularFire
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']){
        this.breweries = af.database.list('/Breweries/'+params['id'], { preserveSnapshot: true });
      } else {
        this.breweries = af.database.list('/Breweries', { preserveSnapshot: true});
      }
      this.breweries.subscribe(
        snapshots => {
          this.isLoading = false;
          snapshots.forEach(snapshot => {
            this.data.push(snapshot.val());
          });
          this.pushMarkers();
        });
    });
  }

  ngOnInit() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.pushCenterMarker();
      });
    }
  }

  pushMarkers() {
    if ( 'string' === typeof(this.data[0]) ) {
      this.markers.push({
        lat: Number(this.data[2]),
        lng: Number(this.data[3]),
        name: this.data[4],
        address: this.data[0],
        city: this.data[1],
        zip: this.data[7],
        url: this.data[6],
        openInfoWindow: true,
      });
      // center map on marker
      this.lat = Number(this.data[2]);
      this.lng = Number(this.data[3]);
    } else {
      this.data.forEach(element => {
        this.markers.push({
          lat: Number(element.latitude),
          lng: Number(element.longitude),
          name: element.name,
          address: element.address,
          city: element.city,
          zip: element.zip,
          url: element.url,
          openInfoWindow: true,
        });
      });
    }
  }

  pushCenterMarker() {
    this.markers.push({
      lat: Number(this.lat),
      lng: Number(this.lng),
      icon: {
        url: '../assets/images/location_marker.svg',
        size: {width: 24, height: 24},
        scaledSize: {width: 24, height: 24},
        anchor: {x: 12, y: 24},
      },
      openInfoWindow: false,
    });
  }
}
