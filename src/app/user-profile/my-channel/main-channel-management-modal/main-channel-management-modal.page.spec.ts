import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChannelManagementModalPage } from './main-channel-management-modal.page';

describe('MainChannelManagementModalPage', () => {
  let component: MainChannelManagementModalPage;
  let fixture: ComponentFixture<MainChannelManagementModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainChannelManagementModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainChannelManagementModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
