import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBlogPage } from './my-blog.page';

describe('MyBlogPage', () => {
  let component: MyBlogPage;
  let fixture: ComponentFixture<MyBlogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBlogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
