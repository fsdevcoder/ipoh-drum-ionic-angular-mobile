import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryPatternModalPage } from './add-inventory-pattern-modal.page';

describe('AddInventoryPatternModalPage', () => {
  let component: AddInventoryPatternModalPage;
  let fixture: ComponentFixture<AddInventoryPatternModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInventoryPatternModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryPatternModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
