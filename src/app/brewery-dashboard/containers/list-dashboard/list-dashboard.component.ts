import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';

import { Brewery } from '../../models/brewery.interface';

@Component({
  selector: 'list-dashboard',
  styleUrls: ['list-dashboard.component.scss'],
  template: `
  <div class="brewery-list">
    <div class="brewery-list__filters">
      <div class="search-input">
        <input
          type="text"
          placeholder="Search by brewery name"
          name="search"
          autocomplete="off"
          [(ngModel)]="search"
        />
      </div>
      <div class="visited-filters" *ngIf="loggedIn">
        <div>
          <input
            type="checkbox"
            name="visited"
            id="visited"
            [(ngModel)]="visited"
            [attr.disabled]="visitedFilter === 'false' ? '' : null"
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
            [attr.disabled]="visitedFilter === 'true' ? '' : null"
            (click)="handleVisitClick($event.target.id)"
          />
          <label for="unvisited" class="checkbox">Unvisited</label>
        </div>
      </div>
    </div>
    <div class="list-container">
      <div *ngIf="(breweries | searchPipe:'name':search).length === 0 && breweries.length !== 0">
        <div class="no-matches">No breweries found.</div>
      </div>
      <div *ngIf="(breweries | searchPipe:'visited':visitedFilter).length === 0">
        <div class="no-matches" *ngIf="visitedFilter === 'true'">You haven't checked in at any breweries yet!</div>
        <div class="no-matches" *ngIf="visitedFilter === 'false'">You did it! You've visited every brewery in Seattle.</div>
      </div>
      <div class="loader" *ngIf="isLoading">
        <div class="loader__bar"></div><div class="loader__bar"></div><div class="loader__bar"></div>
      </div>
      <brewery-detail
        *ngFor="let brewery of breweries | searchPipe:'name':search | searchPipe:'visited':visitedFilter; let i = index"
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
  public visited: boolean = false;
  public unvisited: boolean = false;
  public visitedFilter: string = null;

  private userId: string;
  private visitList: AngularFireList<any[]> = null;
  private breweriesObservable: Observable<any[]>;
  private userVisitsObservable: Observable<any[]>;
  private breweriesSubscription: Subscription;
  private visitsSubscription: Subscription;
  private af: AngularFireDatabase;

  constructor(
    af: AngularFireDatabase,
    private route: ActivatedRoute,
  ) {
    this.route.url.subscribe((url) => {
      if (url[1]) {
        if (url[1].path === 'visited') {
          this.visitedFilter = 'true';
          this.visited = true;
        }
      }
    });

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

      const combinedList = combineLatest([this.breweriesObservable, this.userVisitsObservable]);

      this.visitsSubscription = combinedList.subscribe(val => {
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

  handleVisitClick(target) {
    if (target === 'visited') {
      this.visitedFilter = this.visited === false ? 'true' : null;
    } else if (target === 'unvisited') {
      this.visitedFilter = this.unvisited === false ? 'false' : null;
    }
  }

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
