import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAlertaA } from './card-alerta-a';

describe('CardAlertaA', () => {
  let component: CardAlertaA;
  let fixture: ComponentFixture<CardAlertaA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAlertaA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAlertaA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
