import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {GlobalfunctionService} from './globalfunction.service';

@Injectable({
  providedIn: 'root'
})

export class CheckAuthenticatedService implements CanActivate {

  constructor(
      private authenticationService: AuthenticationService,
      private globalFunctionService: GlobalfunctionService,
      private router: Router
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authenticationService.isUserLoggedIn()) {
      this.globalFunctionService.presentAlertConfirm(
          'WARNING',
          'You are not authenticated, please login before proceeding!',
          'Cancel',
          'Login',
          undefined,
          () => this.redirectToLoginPage());
      return false;
    } else {
      return true;
    }
  }

  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }
}
