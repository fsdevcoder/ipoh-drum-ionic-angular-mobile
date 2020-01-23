import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShippingModalPage } from './add-shipping-modal.page';

describe('AddShippingModalPage', () => {
  let component: AddShippingModalPage;
  let fixture: ComponentFixture<AddShippingModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShippingModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShippingModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
