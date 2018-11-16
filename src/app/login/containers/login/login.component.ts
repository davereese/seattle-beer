import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'login',
  styleUrls: ['login.component.scss'],
  template: `
  <div class="login">
    <div class="form-group">
      <button type="button" class="btn btn-block" (click)="signInWithGoogle()">
        <i class="fa fa-google" aria-hidden="true"></i>
        Login with Google
      </button>
    </div>
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
}
