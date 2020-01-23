import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWarrantyModalPage } from './add-warranty-modal.page';

describe('AddWarrantyModalPage', () => {
  let component: AddWarrantyModalPage;
  let fixture: ComponentFixture<AddWarrantyModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWarrantyModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWarrantyModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
