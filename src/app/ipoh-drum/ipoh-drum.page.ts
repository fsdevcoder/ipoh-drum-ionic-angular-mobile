import {Component, NgZone, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-ipoh-drum',
  templateUrl: './ipoh-drum.page.html',
  styleUrls: ['./ipoh-drum.page.scss'],
})

export class IpohDrumPage implements OnInit {

  // Numbers
  numberOfInventoriesInCart: number;

  // Subscriptions
  numberOfInventoriesInCartSubscription: any;

  constructor(
      private ngZone: NgZone,
      private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.ngZone.run(() => {
      this.numberOfInventoriesInCartSubscription = this.sharedService.emitNumberOfSelectedInventoriesInCart$.subscribe(data => {
        this.numberOfInventoriesInCart = data;
      });
    });
  }
}
