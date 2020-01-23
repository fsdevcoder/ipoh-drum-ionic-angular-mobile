import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChannelModalPage } from './edit-channel-modal.page';

describe('EditChannelModalPage', () => {
  let component: EditChannelModalPage;
  let fixture: ComponentFixture<EditChannelModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChannelModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChannelModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
