import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSidebar } from './ad-sidebar';

describe('AdSidebar', () => {
  let component: AdSidebar;
  let fixture: ComponentFixture<AdSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
