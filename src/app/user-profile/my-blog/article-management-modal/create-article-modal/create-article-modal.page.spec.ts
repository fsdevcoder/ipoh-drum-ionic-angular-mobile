import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArticleModalPage } from './create-article-modal.page';

describe('CreateArticleModalPage', () => {
  let component: CreateArticleModalPage;
  let fixture: ComponentFixture<CreateArticleModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateArticleModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateArticleModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
