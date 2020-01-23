import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArticleModalPage } from './edit-article-modal.page';

describe('EditArticleModalPage', () => {
  let component: EditArticleModalPage;
  let fixture: ComponentFixture<EditArticleModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditArticleModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditArticleModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
