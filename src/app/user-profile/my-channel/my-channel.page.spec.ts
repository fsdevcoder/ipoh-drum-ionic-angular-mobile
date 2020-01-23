import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChannelPage } from './my-channel.page';

describe('MyChannelPage', () => {
  let component: MyChannelPage;
  let fixture: ComponentFixture<MyChannelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyChannelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyChannelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
