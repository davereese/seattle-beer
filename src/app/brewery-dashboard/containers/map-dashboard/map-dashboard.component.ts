import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Brewery } from '../../models/brewery.interface';

interface marker {
	lat: number,
	lng: number,
  name: string,
  address: string,
  city: string,
  zip: number,
  url: string
}

@Component({
  selector: 'map-dashboard',
  styleUrls: ['map-dashboard.component.scss'],
  template: `
  <sebm-google-map
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
      [iconUrl]="icon">

      <sebm-google-map-info-window class="brewery-info">
        <h3>{{ marker.name }}</h3>
        <p>{{ marker.address }}<br>
        {{ marker.city }} WA, {{ marker.zip }}</p>
        <p class="brewery-detail__meta"><a href="{{ marker.url }}" target="_blank">Website</a> | <a href="https://www.google.com/maps/dir/{{marker.address}},{{marker.city}},WA,{{marker.zip}}" target="_blank">Directions</a></p>
      </sebm-google-map-info-window>

    </sebm-google-map-marker>
  </sebm-google-map>
  `
})
export class MapDashboardComponent {
  lat: number = 47.6062;
  lng: number = -122.3321;
  zoom: number = 12;
  style = [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#444444"}]},{"featureType":"all","elementType":"labels","stylers":[{"color":"#373737"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#7f7f7f"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"color":"#252525"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#81ac54"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#383838"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#383838"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#646464"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#252525"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}];
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

  pushMarkers() {
    this.data.forEach(element => {
      this.markers.push({
        lat: Number(element.latitude),
        lng: Number(element.longitude),
        name: element.name,
        address: element.address,
        city: element.city,
        zip: element.zip,
        url: element.url
      });
    });
  }

  constructor(
    af: AngularFire
  ) {
    af.database.list('/Breweries', { preserveSnapshot: true})
      .subscribe(snapshots=>{
          snapshots.forEach(snapshot => {
            this.data.push(snapshot.val());        
          });
          this.pushMarkers();
      });
  }
}
