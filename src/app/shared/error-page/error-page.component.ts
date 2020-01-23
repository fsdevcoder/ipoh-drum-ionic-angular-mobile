import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})

export class ErrorPageComponent implements OnInit {

  constructorName = '[' + this.constructor.name + ']';

  constructor(
      private router: Router
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {}

  navigateToHome() {
    this.router.navigate(['ipoh-drum/home']);
  }
}
