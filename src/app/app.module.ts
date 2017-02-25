import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { firebaseCreds } from '../../firebase/firebase_credentials';

import { BreweryDashboardModule } from './brewery-dashboard/brewery-dashboard.module';

import { HomeComponent } from './home.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    BreweryDashboardModule,
    AngularFireModule.initializeApp(firebaseCreds)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
