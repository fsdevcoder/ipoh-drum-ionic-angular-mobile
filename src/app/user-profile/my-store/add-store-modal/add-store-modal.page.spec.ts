import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoreModalPage } from './add-store-modal.page';

describe('AddStoreModalPage', () => {
  let component: AddStoreModalPage;
  let fixture: ComponentFixture<AddStoreModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoreModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoreModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
