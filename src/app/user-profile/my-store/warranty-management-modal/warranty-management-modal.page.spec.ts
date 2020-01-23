import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyManagementModalPage } from './warranty-management-modal.page';

describe('WarrantyManagementModalPage', () => {
  let component: WarrantyManagementModalPage;
  let fixture: ComponentFixture<WarrantyManagementModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyManagementModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyManagementModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
