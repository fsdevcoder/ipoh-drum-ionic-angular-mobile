import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailsModalPage } from './inventory-details-modal.page';

describe('InventoryDetailsModalPage', () => {
  let component: InventoryDetailsModalPage;
  let fixture: ComponentFixture<InventoryDetailsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDetailsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
