import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMedicoA } from './card-medico-a';

describe('CardMedicoA', () => {
  let component: CardMedicoA;
  let fixture: ComponentFixture<CardMedicoA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMedicoA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMedicoA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
