import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesSolicitudes } from './pacientes-solicitudes';

describe('PacientesSolicitudes', () => {
  let component: PacientesSolicitudes;
  let fixture: ComponentFixture<PacientesSolicitudes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesSolicitudes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientesSolicitudes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
