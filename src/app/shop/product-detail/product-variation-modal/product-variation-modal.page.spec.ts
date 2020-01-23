import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariationModalPage } from './product-variation-modal.page';

describe('ProductVariationModalPage', () => {
  let component: ProductVariationModalPage;
  let fixture: ComponentFixture<ProductVariationModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductVariationModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
