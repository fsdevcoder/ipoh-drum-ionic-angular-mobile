import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {GlobalfunctionService} from './globalfunction.service';

@Injectable({
    providedIn: 'root'
})

export class CheckUnauthenticatedService implements CanActivate {

    constructor(
        private authenticationService: AuthenticationService,
        private globalFunctionService: GlobalfunctionService,
        private router: Router
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return !this.authenticationService.isUserLoggedIn();
    }

    redirectToLoginPage() {
        this.router.navigate(['/login']);
    }
}
