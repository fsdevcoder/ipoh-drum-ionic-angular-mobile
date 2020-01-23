import {Component, OnInit, NgZone, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../_dal/common/services/authentication.service';
import {User, UserControllerServiceService} from '../_dal/ipohdrum';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {commonConfig} from '../_dal/common/commonConfig';
import {GlobalfunctionService} from '../_dal/common/services/globalfunction.service';
import {LoadingService} from '../_dal/common/services/loading.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login-register',
    templateUrl: './login-register.component.html',
    styleUrls: ['./login-register.component.scss'],
})

export class LoginRegisterComponent implements OnInit, OnDestroy {

    constructorName = '[' + this.constructor.name + ']';
    userEmailLogin: string;
    userPasswordLogin: string;

    passwordRegister: string;
    confirmPasswordRegister: string;
    userNameRegex = commonConfig.userNameRegex;
    apiErrorMessage = commonConfig.apiErrorMessage;

    minLengthOfUsername = commonConfig.minLengthOfUsername;
    maxLengthOfUsername = commonConfig.maxLengthOfUsername;
    minLengthOfPassword = 8;
    maxLengthOfPassword = 20;

    userToLogin: User = {} as User;
    userToRegister: User = {} as User;

    showLoginCard = true;
    showRegisterCard = false;

    userLoginFormGroup: FormGroup;
    userRegisterFormGroup: FormGroup;

    userRegisterSubscription: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private ngZone: NgZone,
        private globalFunctionService: GlobalfunctionService,
        private userControllerService: UserControllerServiceService,
        private loadingService: LoadingService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.userLoginFormGroup = new FormGroup({
                userEmail: new FormControl(null, [
                    Validators.required,
                    Validators.email
                ]),
                userPassword: new FormControl(null, [
                    Validators.required
                ])
            });
            this.userRegisterFormGroup = new FormGroup({
                userNameFc: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.minLengthOfUsername),
                    Validators.maxLength(this.maxLengthOfUsername),
                    Validators.pattern(this.userNameRegex)
                ]),
                userEmailFc: new FormControl(null, [
                    Validators.required,
                    Validators.email
                ]),
                userPasswordFc: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.minLengthOfPassword),
                    Validators.maxLength(this.maxLengthOfPassword)
                ]),
                userConfirmPasswordFc: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.minLengthOfPassword),
                    Validators.maxLength(this.maxLengthOfPassword),
                    Validators.pattern(this.userToRegister.password)
                ])
            });
        });
    }

    ngOnDestroy() {
        this.ngZone.run(() => {
            if (this.userRegisterSubscription) {
                this.userRegisterSubscription.unsubscribe();
            }
        });
    }

    ionViewWillEnter() {
        this.userLoginFormGroup.reset();
        this.userRegisterFormGroup.reset();
        this.userToLogin = {} as User;
        this.userToRegister = {} as User;
        this.changeToUserLoginCard();
    }

    ionViewDidLeave() {
        if (this.userRegisterSubscription) {
            this.userRegisterSubscription.unsubscribe();
        }
    }

    loginUser() {
        this.userToLogin.email = this.userEmailLogin;
        this.userToLogin.password = this.userPasswordLogin;
        this.authenticationService.login(this.userToLogin);
    }

    registerUser() {
        this.loadingService.present();
        if (this.userRegisterSubscription) {
            this.userRegisterSubscription.unsubscribe();
        }
        this.userRegisterSubscription = this.userControllerService.createUserWithoutAuthorization(
            this.userToRegister.name,
            this.userToRegister.email,
            this.passwordRegister,
            this.confirmPasswordRegister
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.globalFunctionService.simpleToast('SUCCESS!', 'You are registered.', 'success');
                this.userToRegister.password = this.passwordRegister;
                this.authenticationService.login(this.userToRegister);
            } else {
                this.globalFunctionService.simpleToast('ERROR!', this.apiErrorMessage, 'danger');
            }
            this.loadingService.dismiss();
        }, error => {
            this.globalFunctionService.simpleToast('ERROR!', this.apiErrorMessage, 'danger');
            this.loadingService.dismiss();
        });
    }

    changeToUserRegistrationCard() {
        this.loadingService.present();
        setTimeout(() => {
            this.showHideLoginAndRegisterCards(false, true);
            this.loadingService.dismiss();
        }, 500);
    }

    changeToUserLoginCard() {
        this.loadingService.present();
        setTimeout(() => {
            this.showHideLoginAndRegisterCards(true, false);
            this.loadingService.dismiss();
        }, 500);
    }

    showHideLoginAndRegisterCards(loginFlag: boolean, registerFlag: boolean) {
        this.showLoginCard = loginFlag;
        this.showRegisterCard = registerFlag;
        this.userLoginFormGroup.reset();
        this.userRegisterFormGroup.reset();
    }

    navigateToHomePage() {
        this.loadingService.present();
        setTimeout(() => {
            this.router.navigate(['ipoh-drum/home']).catch(reason => {
               console.log('Unable to navigate to Home page.');
            });
            this.loadingService.dismiss();
        }, 500);
    }
}
