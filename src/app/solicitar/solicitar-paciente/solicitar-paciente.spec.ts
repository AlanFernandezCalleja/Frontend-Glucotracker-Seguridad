import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarPaciente } from './solicitar-paciente';

describe('SolicitarPaciente', () => {
  let component: SolicitarPaciente;
  let fixture: ComponentFixture<SolicitarPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarPaciente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarPaciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
