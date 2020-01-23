import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPromotionModalPage } from './add-promotion-modal.page';

describe('AddPromotionModalPage', () => {
  let component: AddPromotionModalPage;
  let fixture: ComponentFixture<AddPromotionModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPromotionModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPromotionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
