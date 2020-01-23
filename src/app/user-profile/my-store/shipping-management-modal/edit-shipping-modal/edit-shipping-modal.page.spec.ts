import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShippingModalPage } from './edit-shipping-modal.page';

describe('EditShippingModalPage', () => {
  let component: EditShippingModalPage;
  let fixture: ComponentFixture<EditShippingModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShippingModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShippingModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
