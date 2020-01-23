import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {LaravelPassportModule} from 'laravel-passport';
import {UserControllerServiceService} from './_dal/ipohdrum';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthzInterceptor} from './_dal/common/services/authz-interceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from './_dal/common/services/authentication.service';
import {IonicStorageModule} from '@ionic/storage';
import {LoadingService} from './_dal/common/services/loading.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedService} from './shared.service';
import {IpohDrumPageModule} from './ipoh-drum/ipoh-drum.module';
import {Stripe} from '@ionic-native/stripe/ngx';

@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [],
    imports: [
        NgbModule,
        BrowserModule,
        IonicModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        LaravelPassportModule.forRoot(
            {apiRoot: 'http://172.104.45.205', clientId: 2, clientSecret: '2wVl2R67dWAH4ujjKO6b6VJAO3dmKaU31x8XEoaG'}
        ),
        IpohDrumPageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        UserControllerServiceService,
        AuthenticationService,
        LoadingService,
        SharedService,
        Stripe,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthzInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
