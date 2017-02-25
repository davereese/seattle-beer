import { Component, Input, Output } from '@angular/core';

import { Brewery } from '../../models/brewery.interface';

@Component({
  selector: 'brewery-detail',
  styleUrls: ['brewery-detail.component.scss'],
  template: `
    <div class="brewery-detail">
      <span class="brewery-detail__number">{{ 1 + index }}</span>
      <h2 class="brewery-detail__title">{{ detail.name }}</h2>
      <p>{{ detail.address }}<br>
      {{ detail.city }} WA, {{ detail.zip }}</p>
      <p class="brewery-detail__meta"><a href="{{ detail.url }}" target="_blank">Website</a> | <a href="https://www.google.com/maps/dir/{{detail.address}},{{detail.city}},WA,{{detail.zip}}" target="_blank">Directions</a></p>
    </div>
  `
})
export class BreweryDetailComponent {
  @Input()
  detail: Brewery;

  @Input()
  index: Number;
}
