import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpohDrumPage } from './ipoh-drum.page';

describe('IpohDrumPage', () => {
  let component: IpohDrumPage;
  let fixture: ComponentFixture<IpohDrumPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpohDrumPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpohDrumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
