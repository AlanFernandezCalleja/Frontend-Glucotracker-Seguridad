import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePacienteSolicitud } from './detalle-paciente-solicitud';

describe('DetallePacienteSolicitud', () => {
  let component: DetallePacienteSolicitud;
  let fixture: ComponentFixture<DetallePacienteSolicitud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePacienteSolicitud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePacienteSolicitud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
