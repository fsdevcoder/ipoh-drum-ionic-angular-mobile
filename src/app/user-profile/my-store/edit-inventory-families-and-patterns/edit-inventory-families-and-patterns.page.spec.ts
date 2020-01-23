import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInventoryFamiliesAndPatternsPage } from './edit-inventory-families-and-patterns.page';

describe('EditInventoryFamiliesAndPatternsPage', () => {
  let component: EditInventoryFamiliesAndPatternsPage;
  let fixture: ComponentFixture<EditInventoryFamiliesAndPatternsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInventoryFamiliesAndPatternsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInventoryFamiliesAndPatternsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
