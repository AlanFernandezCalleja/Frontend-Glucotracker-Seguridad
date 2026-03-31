import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedSidebar } from './med-sidebar';

describe('MedSidebar', () => {
  let component: MedSidebar;
  let fixture: ComponentFixture<MedSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
