import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStatisticsPage } from './my-statistics.page';

describe('MyStatisticsPage', () => {
  let component: MyStatisticsPage;
  let fixture: ComponentFixture<MyStatisticsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyStatisticsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStatisticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
