import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(
    private _firebaseAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          sessionStorage.setItem('uid', user.uid);
        }
        else {
          this.userDetails = null;
        }
      }
    );
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  isLoggedIn() {
    if (this.userDetails == null ) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    sessionStorage.removeItem('uid');
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['/']));
  }
}
