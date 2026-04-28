import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSolicitud } from './card-solicitud';

describe('CardSolicitud', () => {
  let component: CardSolicitud;
  let fixture: ComponentFixture<CardSolicitud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSolicitud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSolicitud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
