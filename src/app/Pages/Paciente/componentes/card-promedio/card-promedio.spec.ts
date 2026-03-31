import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPromedio } from './card-promedio';

describe('CardPromedio', () => {
  let component: CardPromedio;
  let fixture: ComponentFixture<CardPromedio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPromedio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPromedio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
