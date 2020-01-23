import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlogModalPage } from './add-blog-modal.page';

describe('AddBlogModalPage', () => {
  let component: AddBlogModalPage;
  let fixture: ComponentFixture<AddBlogModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBlogModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBlogModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
