import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementModalPage } from './inventory-management-modal.page';

describe('InventoryManagementModalPage', () => {
  let component: InventoryManagementModalPage;
  let fixture: ComponentFixture<InventoryManagementModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryManagementModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryManagementModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
