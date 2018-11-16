import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Brewery } from '../../models/brewery.interface';

@Component({
  selector: 'brewery-detail',
  styleUrls: ['brewery-detail.component.scss'],
  template: `
    <div
      class="brewery-detail"
      [ngClass]="{'visited': detail.visited}"
    >
      <span class="brewery-detail__number">{{ 1 + index }}</span>
      <h2 class="brewery-detail__title">
        <a
          [routerLink]="'/map/'+detail.key"
          *ngIf="detail.latitude && detail.longitude"
        >{{ detail.name }}</a>
        <span *ngIf="!detail.latitude && !detail.longitude">{{ detail.name }}</span>
      </h2>
      <p>{{ detail.address }}<br>
      {{ detail.city }} WA<span *ngIf="detail.zip">,</span> {{ detail.zip }}</p>
      <tag *ngFor="let tag of tags" [tag]="tag"></tag>
      <p class="brewery-detail__meta"><a href="{{ detail.url }}" target="_blank">Website</a><span *ngIf="detail.latitude && detail.longitude"> | <a href="https://www.google.com/maps/dir//{{detail.address}},{{detail.city}},WA,{{detail.zip}}" target="_blank">Directions</a></span></p>
      <div
        class="visited-toggles"
        *ngIf="loggedIn"
      >
        <button
          *ngIf="!detail.visited"
          type="button"
          class="button-check-in"
          (click)="checkInClick(detail.key)"
        >Check In</button>
        <button
          *ngIf="detail.visited"
          type="button"
          class="button-reset"
          (click)="resetClick(detail.key)"
        >reset</button>
      </div>
    </div>
  `
})
export class BreweryDetailComponent {
  tags: Array<string>;

  @Input() detail: Brewery;
  @Input() index: number;
  @Input() loggedIn: boolean;
  @Output() checkIn: EventEmitter<any> = new EventEmitter<any>();
  @Output() reset: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.tags = this.detail.tags !== '' ? this.detail.tags.split(',') : null;
  }

  checkInClick(key) {
    this.checkIn.emit(key);
  }

  resetClick(key) {
    this.reset.emit(key);
  }
}
