import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Brewery } from './brewery-dashboard/models/brewery.interface';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  template: `
    <div class="home">
      <div class="intro-text">
        <h1 *ngIf="!userId" class="hidden-xs">
          This is Seattle. Home to
          <a routerLink="/list">{{ breweriesCount || '100' }}</a>
          PNW breweries. From
          <a [routerLink]="'map/'+brewery1?.key">{{ brewery1?.shortName }}</a> to
          <a [routerLink]="'map/'+brewery2?.key">{{ brewery2?.shortName }}</a>,
          <a [routerLink]="'map/'+brewery3?.key">{{ brewery3?.shortName }}</a> to
          <a [routerLink]="'map/'+brewery4?.key">{{ brewery4?.shortName }}</a>,
          we'll help you find them all.
        </h1>
        <h1 *ngIf="userId" class="hidden-xs">
          Welcome<span *ngIf="userName">, {{ userName }}</span>!<br>
          You have visited {{ visits }} out of all <a routerLink="/list">{{ breweriesCount }}</a> Seattle Breweries. We'll help you find them all
        </h1>
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
  breweriesCount: number
  breweries: Observable<any[]>;
  visitedBreweries: Observable<any[]>;
  visitsSubscription: Subscription;
  visits: number;
  data = [];
  brewery1: Brewery;
  brewery2: Brewery;
  brewery3: Brewery;
  brewery4: Brewery;
  userId: string;
  userName: string;

  constructor(
    af: AngularFireDatabase,
    private authService: AuthService,
  ) {
    this.breweries = af.list('/Breweries').snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({ key: a.key, ...a.payload.val() }))
      )
    );
    this.breweries.map(list => list.length).subscribe(length => this.breweriesCount = length);

    this.breweries.subscribe( snapshots => {
          snapshots = this.shuffle(snapshots);
          snapshots.forEach(snapshot => {
            this.data.push(snapshot);
          });
          this.brewery1 = this.data[0];
          this.brewery2 = this.data[1];
          this.brewery3 = this.data[2];
          this.brewery4 = this.data[3];
      });

    this.userId = sessionStorage.getItem('uid');

    if (this.userId) {
      this.authService.getUser().subscribe(
        (user) => {
          if (user) {
            this.userName = user.displayName;
          } else {
            this.userId = null;
            if (this.visitsSubscription) {
              this.visitsSubscription.unsubscribe();
            }
          }
        }
      );

      this.visitedBreweries = af.list(`Visits/${this.userId}`).snapshotChanges().pipe(
        map(actions =>
          actions.map(a => ({ key: a.key, ...a.payload.val() }))
        )
      );
      this.visitsSubscription = this.visitedBreweries.subscribe(val => {
        this.visits = val.length;
      });
    }
  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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

  ngOnDestroy() {
    if (this.visitsSubscription) {
      this.visitsSubscription.unsubscribe();
    }
  }
}
