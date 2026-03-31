import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteShell } from './paciente-shell';

describe('PacienteShell', () => {
  let component: PacienteShell;
  let fixture: ComponentFixture<PacienteShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
