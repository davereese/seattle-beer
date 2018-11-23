import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseCreds } from '../../firebase/firebase_credentials';

import { BreweryDashboardModule } from './brewery-dashboard/brewery-dashboard.module';
import { LoginModule } from './login/login.module';

import { HomeComponent } from './home.component';
import { AppComponent } from './app.component';

import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    BreweryDashboardModule,
    LoginModule,
    AngularFireModule.initializeApp(firebaseCreds),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
