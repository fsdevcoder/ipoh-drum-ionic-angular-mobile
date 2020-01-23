import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderDetailsModalPage } from './view-order-details-modal.page';

describe('ViewOrderDetailsModalPage', () => {
  let component: ViewOrderDetailsModalPage;
  let fixture: ComponentFixture<ViewOrderDetailsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOrderDetailsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrderDetailsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
