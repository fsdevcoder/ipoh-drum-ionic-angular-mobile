import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoreModalPage } from './edit-store-modal.page';

describe('EditStoreModalPage', () => {
  let component: EditStoreModalPage;
  let fixture: ComponentFixture<EditStoreModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStoreModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoreModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
