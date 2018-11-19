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
      <button
        type="button"
        class="btn btn--icon btn--google"
        (click)="signInWithGoogle()"
      >Sign In with Google
      </button>
      <br />
      <div class="email-btn-container" [ngClass]="{'open': !formOpen}">
        <button
          type="button"
          class="btn btn--icon btn--email"
          (click)="openForm()"
        >Sign In with Email
        </button>
      </div>
      <form
        name="userform"
        method="post"
        #formCtrl="ngForm"
        [ngClass]="{'open': formOpen}"
      >
        <button
          type="button"
          class="close"
          (click)="closeForm()"
        >X</button>
        <p>Sign In with Email</p>
        <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
        <div class="form-group">
          <input
            type="email"
            class="form-control"
            [(ngModel)]="user.email"
            id="email"
            name="email"
            autocomplete="off"
            required
          >
          <label for="email">Email address</label>
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            [(ngModel)]="user.password"
            id="password"
            name="password"
            autocomplete="off"
            required
          >
          <label for="password">Password</label>
        </div>
        <div class="form-group toggle">
          <label for="up-or-in">Sign Up</label>
          <input
            type="checkbox"
            id="up-or-in"
            name="up-or-in"
            class="toggle"
            checked
            (click)="toggleAction()"
          >
          <label for="up-or-in">Sign In</label>
        </div>
        <button
          type="button"
          class="btn btn--submit"
          (click)="signInWithEmail()"
        >
          <span *ngIf="signIn">Sign In</span>
          <span *ngIf="!signIn">Sign Up</span>
        </button>
      </form>
    </div>
    <div class="login__background"></div>
  </div>
  `
})
export class LoginComponent {
  // variables
  formOpen: boolean = false;
  signIn: boolean = true;
  user = {
    email: '',
    password: ''
  };
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  openForm() {
    this.formOpen = true;
  }

  closeForm() {
    this.formOpen = false;
    window.setTimeout((function() {
      this.errorMessage = null;
      this.user = {
        email: '',
        password: ''
      };
    }).bind(this), 350);
  }

  toggleAction() {
    this.signIn = !this.signIn;
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then((res) => {
        this.router.navigateByUrl('');
      })
    .catch((err) => this.errorMessage = err);
  }

  signUpWithEmail() {
    this.authService.signUpAndInWithEmail(this.user.email, this.user.password)
    .then((res) => {
      this.router.navigateByUrl('');
    })
    .catch((err) => this.errorMessage = err);
  }

  signInWithEmail() {
    if (this.signIn) {
      this.authService.signInWithEmail(this.user.email, this.user.password)
      .then((res) => {
        this.router.navigateByUrl('');
      })
      .catch((err) => this.errorMessage = err);
    } else {
      this.signUpWithEmail();
    }
  }
}
