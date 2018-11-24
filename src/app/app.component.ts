import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

interface Nav {
  link: string,
  name: string,
  image: string,
  exact: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public nav: Nav[] = [
    {
      link: '/list',
      name: 'LIST',
      image: 'assets/images/list.svg',
      exact: true
    },
    {
      link: '/map',
      name: 'MAP',
      image: 'assets/images/map.svg',
      exact: true
    }
  ];

  private currentPage: string;

  constructor(public authService: AuthService, private router: Router) {
    router.events.subscribe((val) => {
        this.currentPage = router.url;
    });
  }
}
