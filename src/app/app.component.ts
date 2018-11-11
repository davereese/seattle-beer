import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Nav {
  link: string,
  name: string,
  image?: string,
  exact: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  nav: Nav[] = [
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

  currentPage: string;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
        this.currentPage = router.url;
    });
  }
}
