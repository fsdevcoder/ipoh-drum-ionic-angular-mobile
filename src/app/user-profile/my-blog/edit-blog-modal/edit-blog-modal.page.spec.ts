import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBlogModalPage } from './edit-blog-modal.page';

describe('EditBlogModalPage', () => {
  let component: EditBlogModalPage;
  let fixture: ComponentFixture<EditBlogModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBlogModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBlogModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
