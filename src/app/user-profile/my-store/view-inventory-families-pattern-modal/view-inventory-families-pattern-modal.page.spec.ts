import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventoryFamiliesPatternModalPage } from './view-inventory-families-pattern-modal.page';

describe('ViewInventoryFamiliesPatternModalPage', () => {
  let component: ViewInventoryFamiliesPatternModalPage;
  let fixture: ComponentFixture<ViewInventoryFamiliesPatternModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInventoryFamiliesPatternModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInventoryFamiliesPatternModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
