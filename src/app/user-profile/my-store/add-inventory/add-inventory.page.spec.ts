import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryPage } from './add-inventory.page';

describe('AddInventoryPage', () => {
  let component: AddInventoryPage;
  let fixture: ComponentFixture<AddInventoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInventoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
