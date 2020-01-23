import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPromotionModalPage } from './edit-promotion-modal.page';

describe('EditPromotionModalPage', () => {
  let component: EditPromotionModalPage;
  let fixture: ComponentFixture<EditPromotionModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPromotionModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPromotionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
