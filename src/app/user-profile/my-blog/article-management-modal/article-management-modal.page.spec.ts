import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleManagementModalPage } from './article-management-modal.page';

describe('ArticleManagementModalPage', () => {
  let component: ArticleManagementModalPage;
  let fixture: ComponentFixture<ArticleManagementModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleManagementModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleManagementModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
