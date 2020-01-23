import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvFamilyPatternModalPage } from './inv-family-pattern-modal.page';

describe('InvFamilyPatternModalPage', () => {
  let component: InvFamilyPatternModalPage;
  let fixture: ComponentFixture<InvFamilyPatternModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvFamilyPatternModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvFamilyPatternModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
