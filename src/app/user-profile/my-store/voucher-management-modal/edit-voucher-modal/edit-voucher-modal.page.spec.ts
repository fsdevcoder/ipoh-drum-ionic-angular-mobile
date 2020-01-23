import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVoucherModalPage } from './edit-voucher-modal.page';

describe('EditVoucherModalPage', () => {
  let component: EditVoucherModalPage;
  let fixture: ComponentFixture<EditVoucherModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVoucherModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVoucherModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
