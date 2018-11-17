import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'login',
  styleUrls: ['login.component.scss'],
  template: `
  <div class="login">
    <h1 class="login__header">Sign In or Sign Up</h1>
    <div class="login__form">
      <button type="button" class="btn btn-block btn--google" (click)="signInWithGoogle()">
        Sign In with Google
      </button>
      <br />
      <button type="button" class="btn btn-block btn--email" (click)="signInWithEmail()">
        Sign In with Email
      </button>
    </div>
    <div class="login__background"></div>
  </div>
  `
})
export class LoginComponent {
  // variables

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then((res) => {
        this.router.navigateByUrl('')
      })
    .catch((err) => console.log(err));
  }

  signInWithEmail() {

  }
}
