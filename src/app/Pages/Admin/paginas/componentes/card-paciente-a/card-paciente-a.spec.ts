import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPacienteA } from './card-paciente-a';

describe('CardPacienteA', () => {
  let component: CardPacienteA;
  let fixture: ComponentFixture<CardPacienteA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPacienteA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPacienteA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
