import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

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
      [(ngModel)]="search"
    />
    <div class="list-container">
      <div *ngIf="(breweries | async | searchPipe:'name':search).length === 0">
        <div class="no-matches">No breweries found.</div>
      </div>
      <div class="loader" *ngIf="isLoading">
        <div class="loader__bar"></div><div class="loader__bar"></div><div class="loader__bar"></div>
      </div>
      <brewery-detail
        *ngFor="let brewery of breweries | async | searchPipe:'name':search; let i = index"
        [detail]="brewery"
        [index]="i">
      </brewery-detail>
    </div>
  </div>
  `
})
export class ListDashboardComponent {
  breweries: Observable<any[]>;
  isLoading: boolean = true;
  search: string;

  constructor(
    af: AngularFireDatabase
  ) {
    this.breweries = af.list('/Breweries').valueChanges();
    this.breweries.subscribe(complete => this.isLoading = false);
  }
}
