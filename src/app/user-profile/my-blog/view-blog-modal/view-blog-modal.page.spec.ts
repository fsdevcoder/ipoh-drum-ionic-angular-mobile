import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlogModalPage } from './view-blog-modal.page';

describe('ViewBlogModalPage', () => {
  let component: ViewBlogModalPage;
  let fixture: ComponentFixture<ViewBlogModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBlogModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBlogModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
