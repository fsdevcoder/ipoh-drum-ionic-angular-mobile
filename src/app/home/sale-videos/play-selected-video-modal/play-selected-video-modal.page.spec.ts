import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySelectedVideoModalPage } from './play-selected-video-modal.page';

describe('PlaySelectedVideoModalPage', () => {
  let component: PlaySelectedVideoModalPage;
  let fixture: ComponentFixture<PlaySelectedVideoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaySelectedVideoModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaySelectedVideoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
