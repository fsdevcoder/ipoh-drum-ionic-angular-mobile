import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWarrantyModalPage } from './edit-warranty-modal.page';

describe('EditWarrantyModalPage', () => {
  let component: EditWarrantyModalPage;
  let fixture: ComponentFixture<EditWarrantyModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWarrantyModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWarrantyModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
