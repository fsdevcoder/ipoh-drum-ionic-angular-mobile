import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoManagementModalPage } from './video-management-modal.page';

describe('VideoManagementModalPage', () => {
  let component: VideoManagementModalPage;
  let fixture: ComponentFixture<VideoManagementModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoManagementModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoManagementModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
