import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleVideosComponent } from './sale-videos.component';

describe('SaleVideosComponent', () => {
  let component: SaleVideosComponent;
  let fixture: ComponentFixture<SaleVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleVideosComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
