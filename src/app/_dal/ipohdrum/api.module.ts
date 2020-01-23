import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { ArticleControllerServiceService } from './api/articleControllerService.service';
import { ArticleImageControllerServiceService } from './api/articleImageControllerService.service';
import { BloggerControllerServiceService } from './api/bloggerControllerService.service';
import { CategoryControllerServiceService } from './api/categoryControllerService.service';
import { ChannelControllerServiceService } from './api/channelControllerService.service';
import { CommentControllerServiceService } from './api/commentControllerService.service';
import { CompanyControllerServiceService } from './api/companyControllerService.service';
import { CompanyTypeControllerServiceService } from './api/companyTypeControllerService.service';
import { GroupControllerServiceService } from './api/groupControllerService.service';
import { InventoryControllerServiceService } from './api/inventoryControllerService.service';
import { InventoryImageControllerServiceService } from './api/inventoryImageControllerService.service';
import { ModuleControllerServiceService } from './api/moduleControllerService.service';
import { PaymentControllerServiceService } from './api/paymentControllerService.service';
import { ProductFeatureControllerServiceService } from './api/productFeatureControllerService.service';
import { ProductPromotionControllerServiceService } from './api/productPromotionControllerService.service';
import { ProductReviewControllerServiceService } from './api/productReviewControllerService.service';
import { RoleControllerServiceService } from './api/roleControllerService.service';
import { SaleControllerServiceService } from './api/saleControllerService.service';
import { ShippingControllerServiceService } from './api/shippingControllerService.service';
import { StoreControllerServiceService } from './api/storeControllerService.service';
import { StoreReviewControllerServiceService } from './api/storeReviewControllerService.service';
import { TicketControllerServiceService } from './api/ticketControllerService.service';
import { TypeControllerServiceService } from './api/typeControllerService.service';
import { UserControllerServiceService } from './api/userControllerService.service';
import { VerificationCodeControllerServiceService } from './api/verificationCodeControllerService.service';
import { VideoControllerServiceService } from './api/videoControllerService.service';
import { VoucherCodeControllerServiceService } from './api/voucherCodeControllerService.service';
import { VoucherControllerServiceService } from './api/voucherControllerService.service';
import { WarrantyControllerServiceService } from './api/warrantyControllerService.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    ArticleControllerServiceService,
    ArticleImageControllerServiceService,
    BloggerControllerServiceService,
    CategoryControllerServiceService,
    ChannelControllerServiceService,
    CommentControllerServiceService,
    CompanyControllerServiceService,
    CompanyTypeControllerServiceService,
    GroupControllerServiceService,
    InventoryControllerServiceService,
    InventoryImageControllerServiceService,
    ModuleControllerServiceService,
    PaymentControllerServiceService,
    ProductFeatureControllerServiceService,
    ProductPromotionControllerServiceService,
    ProductReviewControllerServiceService,
    RoleControllerServiceService,
    SaleControllerServiceService,
    ShippingControllerServiceService,
    StoreControllerServiceService,
    StoreReviewControllerServiceService,
    TicketControllerServiceService,
    TypeControllerServiceService,
    UserControllerServiceService,
    VerificationCodeControllerServiceService,
    VideoControllerServiceService,
    VoucherCodeControllerServiceService,
    VoucherControllerServiceService,
    WarrantyControllerServiceService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
