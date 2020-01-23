import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInventoryPatternsPage } from './edit-inventory-patterns.page';

describe('EditInventoryPatternsPage', () => {
  let component: EditInventoryPatternsPage;
  let fixture: ComponentFixture<EditInventoryPatternsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInventoryPatternsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInventoryPatternsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
