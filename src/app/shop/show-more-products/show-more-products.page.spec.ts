import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMoreProductsPage } from './show-more-products.page';

describe('ShowMoreProductsPage', () => {
  let component: ShowMoreProductsPage;
  let fixture: ComponentFixture<ShowMoreProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMoreProductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMoreProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
