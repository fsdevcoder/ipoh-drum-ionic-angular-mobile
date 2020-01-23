import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVideoModalPage } from './edit-video-modal.page';

describe('EditVideoModalPage', () => {
  let component: EditVideoModalPage;
  let fixture: ComponentFixture<EditVideoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVideoModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVideoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
