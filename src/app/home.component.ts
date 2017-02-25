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
        <h1 class="hidden-xs">This is Seattle. Home to <a routerLink="/list">{{ breweriesCount || '100' }}</a> PNW breweries. From {{ brewery1 }} to {{ brewery2 }}, {{ brewery3 }} to {{ brewery4 }}, we'll help you find them all.</h1>
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
  brewery1: string;
  brewery2: string;
  brewery3: string;
  brewery4: string;

  constructor(
    af: AngularFire
  ) {
    this.breweries = af.database.list('/Breweries', { preserveSnapshot: true});
    this.breweries.map(list => list.length).subscribe(length => this.breweriesCount = length);

    this.breweries.subscribe(snapshots=>{
          snapshots = this.shuffle(snapshots);
          snapshots.forEach(snapshot => {
            this.data.push(snapshot.val());        
          });
          this.brewery1 = this.data[0].shortName;
          this.brewery2 = this.data[1].shortName;
          this.brewery3 = this.data[2].shortName;
          this.brewery4 = this.data[3].shortName;
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
