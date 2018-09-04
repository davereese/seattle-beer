import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from './pipes/search-pipe/search.pipe';

// containers
import { MapDashboardComponent } from './containers/map-dashboard/map-dashboard.component';
import { ListDashboardComponent } from './containers/list-dashboard/list-dashboard.component';

// components
import { BreweryDetailComponent } from './components/brewery-detail/brewery-detail.component';
import { TagComponent } from './components/tags/tag.component';

const routes: Routes = [
  { path: 'map',
    children: [
      { path: '', component: MapDashboardComponent },
      { path: ':id', component: MapDashboardComponent }
    ]
  },
  { path: 'list', component: ListDashboardComponent }
];

@NgModule({
  declarations: [
    MapDashboardComponent,
    ListDashboardComponent,
    BreweryDetailComponent,
    TagComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDCyIV6cqUIhjtQHeemH4X9eAABSx22sd4'
    })
  ],
  providers: [
  ]
})
export class BreweryDashboardModule { }
