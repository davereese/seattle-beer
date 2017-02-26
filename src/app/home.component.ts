import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Brewery } from './brewery-dashboard/models/brewery.interface';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  template: `
    <div class="home">
      <div class="intro-text">
        <h1 class="hidden-xs">This is Seattle. Home to <a routerLink="/list">{{ breweriesCount || '100' }}</a> PNW breweries. From <a [routerLink]="'map/'+brewery1?.id">{{ brewery1?.shortName }}</a> to <a [routerLink]="'map/'+brewery2?.id">{{ brewery2?.shortName }}</a>, <a [routerLink]="'map/'+brewery3?.id">{{ brewery3?.shortName }}</a> to <a [routerLink]="'map/'+brewery4?.id">{{ brewery4?.shortName }}</a>, we'll help you find them all.</h1>
      </div>

      <div class="button-overlay">
        <div class="button-overlay__button">
            <a routerLink="/list">
                <div class="circle"></div>
                <img src="assets/images/list.svg" alt="Brewery List">
                Brewery List
            </a>
        </div>
        <div class="button-overlay__button">
            <a routerLink="/map">
                <div class="circle"></div>
                <img src="assets/images/map.svg" alt="Brewery Map">
                Brewery Map
            </a>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  breweriesCount: FirebaseListObservable<any>;
  breweries: FirebaseListObservable<any>;
  data = [];
  brewery1: Brewery;
  brewery2: Brewery;
  brewery3: Brewery;
  brewery4: Brewery;

  constructor(
    af: AngularFire
  ) {
    this.breweries = af.database.list('/Breweries', { preserveSnapshot: true});
    this.breweries.map(list => list.length).subscribe(length => this.breweriesCount = length);

    this.breweries.subscribe(snapshots=>{
          snapshots = this.shuffle(snapshots);
          snapshots.forEach(snapshot => {
            let tempSnapshot = snapshot.val();
            tempSnapshot.id = snapshot.key;
            this.data.push(tempSnapshot);
          });
          this.brewery1 = this.data[0];
          this.brewery2 = this.data[1];
          this.brewery3 = this.data[2];
          this.brewery4 = this.data[3];
      });
  }
  
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
