import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteSidebar } from './paciente-sidebar';

describe('PacienteSidebar', () => {
  let component: PacienteSidebar;
  let fixture: ComponentFixture<PacienteSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
