import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMedicoSolicitud } from './detalle-medico-solicitud';

describe('DetalleMedicoSolicitud', () => {
  let component: DetalleMedicoSolicitud;
  let fixture: ComponentFixture<DetalleMedicoSolicitud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMedicoSolicitud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleMedicoSolicitud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
