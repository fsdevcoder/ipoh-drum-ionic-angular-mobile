import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelModalPage } from './add-channel-modal.page';

describe('AddChannelModalPage', () => {
  let component: AddChannelModalPage;
  let fixture: ComponentFixture<AddChannelModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChannelModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChannelModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
