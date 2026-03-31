import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesActivos } from './pacientes-activos';

describe('PacientesActivos', () => {
  let component: PacientesActivos;
  let fixture: ComponentFixture<PacientesActivos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesActivos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientesActivos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
