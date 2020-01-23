import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {UserProfilePage} from './user-profile.page';

const routes: Routes = [
    {
        path: '',
        component: UserProfilePage,
        children: [
            {path: '', pathMatch: 'full', redirectTo: '/ipoh-drum/user-profile/my-profile'},
            {path: 'my-profile', loadChildren: '../user-profile/my-profile/my-profile.module#MyProfilePageModule'},
            {path: 'my-store', loadChildren: '../user-profile/my-store/my-store.module#MyStorePageModule'},
            {path: 'my-blog', loadChildren: '../user-profile/my-blog/my-blog.module#MyBlogPageModule'},
            {path: 'my-channel', loadChildren: '../user-profile/my-channel/my-channel.module#MyChannelPageModule'},
            {path: 'my-orders', loadChildren: '../user-profile/my-orders/my-orders.module#MyOrdersPageModule'},
            {path: 'my-statistics', loadChildren: '../user-profile/my-statistics/my-statistics.module#MyStatisticsPageModule'},
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        UserProfilePage
    ]
})

export class UserProfilePageModule {
}
