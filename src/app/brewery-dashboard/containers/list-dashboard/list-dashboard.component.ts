import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Brewery } from '../../models/brewery.interface';

@Component({
  selector: 'list-dashboard',
  styleUrls: ['list-dashboard.component.scss'],
  template: `
  <div class="brewery-list">
    <brewery-detail
      *ngFor="let brewery of breweries | async; let i = index"
      [detail]="brewery"
      [index]="i">
    </brewery-detail>
  </div>
  `
})
export class ListDashboardComponent {
  breweries: FirebaseListObservable<any>;

  constructor(
    af: AngularFire
  ) {
    this.breweries = af.database.list('/Breweries');
  }
}
