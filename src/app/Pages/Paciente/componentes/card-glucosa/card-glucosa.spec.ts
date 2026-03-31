import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGlucosa } from './card-glucosa';

describe('CardGlucosa', () => {
  let component: CardGlucosa;
  let fixture: ComponentFixture<CardGlucosa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGlucosa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGlucosa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
