import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {BottomMenuComponent} from './bottom-menu/bottom-menu.component';
import {RouterModule} from '@angular/router';
import { MyCurrencyPipe } from './my-currency.pipe';
import {VideoUrlSanitizerPipe} from './video-url-sanitizer.pipe';

@NgModule({
    declarations: [
        BottomMenuComponent,
        MyCurrencyPipe,
        VideoUrlSanitizerPipe
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule
    ],
    exports: [
        BottomMenuComponent,
        MyCurrencyPipe,
        VideoUrlSanitizerPipe
    ]
})

export class SharedModule {
}
