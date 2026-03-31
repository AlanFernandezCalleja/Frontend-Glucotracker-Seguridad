import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePacienteActivo } from './detalle-paciente-activo';

describe('DetallePacienteActivo', () => {
  let component: DetallePacienteActivo;
  let fixture: ComponentFixture<DetallePacienteActivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePacienteActivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePacienteActivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
