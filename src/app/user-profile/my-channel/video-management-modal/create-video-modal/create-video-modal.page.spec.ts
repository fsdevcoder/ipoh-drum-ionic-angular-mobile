import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVideoModalPage } from './create-video-modal.page';

describe('CreateVideoModalPage', () => {
  let component: CreateVideoModalPage;
  let fixture: ComponentFixture<CreateVideoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVideoModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVideoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
