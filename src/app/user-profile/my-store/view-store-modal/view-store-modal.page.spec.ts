import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStoreModalPage } from './view-store-modal.page';

describe('ViewStoreModalPage', () => {
  let component: ViewStoreModalPage;
  let fixture: ComponentFixture<ViewStoreModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStoreModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStoreModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
