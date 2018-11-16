import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription, forkJoin, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/map';

import { Brewery } from '../../models/brewery.interface';

@Component({
  selector: 'list-dashboard',
  styleUrls: ['list-dashboard.component.scss'],
  template: `
  <div class="brewery-list">
    <input
      type="text"
      placeholder="Search by brewery name"
      name="search"
      autocomplete="off"
      [(ngModel)]="search"
    />
    <div class="list-container">
      <div *ngIf="(breweries | searchPipe:'name':search).length === 0 && breweries.length !== 0">
        <div class="no-matches">No breweries found.</div>
      </div>
      <div class="loader" *ngIf="isLoading">
        <div class="loader__bar"></div><div class="loader__bar"></div><div class="loader__bar"></div>
      </div>
      <brewery-detail
        *ngFor="let brewery of breweries | searchPipe:'name':search; let i = index"
        [detail]="brewery"
        [index]="i"
        [loggedIn]="loggedIn"
        (checkIn)="handleCheckIn($event)"
        (reset)="handleReset($event)"
      ></brewery-detail>
    </div>
  </div>
  `
})
export class ListDashboardComponent {
  public breweries: Brewery[] = [];
  public isLoading: boolean = true;
  public search: string;
  public loggedIn: boolean = false;

  private userId: string;
  private visitList: AngularFireList<any[]> = null;
  private breweriesObservable: Observable<any[]>;
  private userVisitsObservable: Observable<any[]>;
  private breweriesSubscription: Subscription;
  private visitsSubscription: Subscription;
  private af: AngularFireDatabase;

  constructor(
    af: AngularFireDatabase
  ) {
    this.breweriesObservable = af.list('/Breweries').snapshotChanges().pipe(
        map(actions =>
          actions.map(a => ({ key: a.key, ...a.payload.val() }))
        )
      );

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

      const example = combineLatest([this.breweriesObservable, this.userVisitsObservable]);

      this.visitsSubscription = example.subscribe(val => {
          this.breweries = val[0].map((brewery): Brewery => {
            // check to see if the berewery's key is in the userVisits array
            const brewerykey = brewery.key;
            brewery.visited = val[1].some(index => index.key === brewerykey );
            return brewery;
          });
          this.isLoading = false;
        });
    } else {
      // if not logged in
      this.breweriesSubscription = this.breweriesObservable.subscribe(complete => {
          this.breweries = complete;
          this.isLoading = false;
        });
    }
  }

  ngOnInit() {}

  handleCheckIn(key) {
    this.visitList.set(key, [true]);
  }

  handleReset(key) {
    this.visitList.remove(key);
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
