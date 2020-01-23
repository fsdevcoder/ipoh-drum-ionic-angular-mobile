import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoucherModalPage } from './add-voucher-modal.page';

describe('AddVoucherModalPage', () => {
  let component: AddVoucherModalPage;
  let fixture: ComponentFixture<AddVoucherModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVoucherModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVoucherModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
