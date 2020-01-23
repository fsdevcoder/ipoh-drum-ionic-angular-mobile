import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInfoModalPage } from './payment-info-modal.page';

describe('PaymentInfoModalPage', () => {
  let component: PaymentInfoModalPage;
  let fixture: ComponentFixture<PaymentInfoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentInfoModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInfoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
