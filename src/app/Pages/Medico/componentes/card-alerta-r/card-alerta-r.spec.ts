import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAlertaR } from './card-alerta-r';

describe('CardAlertaR', () => {
  let component: CardAlertaR;
  let fixture: ComponentFixture<CardAlertaR>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAlertaR]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAlertaR);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
