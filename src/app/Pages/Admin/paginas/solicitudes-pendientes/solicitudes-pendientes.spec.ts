import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesPendientes } from './solicitudes-pendientes';

describe('SolicitudesPendientes', () => {
  let component: SolicitudesPendientes;
  let fixture: ComponentFixture<SolicitudesPendientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesPendientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesPendientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
