import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteCard } from './paciente-card';

describe('PacienteCard', () => {
  let component: PacienteCard;
  let fixture: ComponentFixture<PacienteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
