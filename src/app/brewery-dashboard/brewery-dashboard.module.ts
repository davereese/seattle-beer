import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from 'angular2-google-maps/core';

// containers
import { MapDashboardComponent } from './containers/map-dashboard/map-dashboard.component';
import { ListDashboardComponent } from './containers/list-dashboard/list-dashboard.component';

// components
import { BreweryDetailComponent } from './components/brewery-detail/brewery-detail.component';

const routes: Routes = [
  { path: 'map', component: MapDashboardComponent },
  { path: 'list', component: ListDashboardComponent }
];

@NgModule({
  declarations: [
    MapDashboardComponent,
    ListDashboardComponent,
    BreweryDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDCyIV6cqUIhjtQHeemH4X9eAABSx22sd4'
    })
  ],
  providers: [
  ]
})
export class BreweryDashboardModule { }
