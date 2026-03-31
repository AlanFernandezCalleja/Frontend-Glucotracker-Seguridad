import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdminA } from './card-admin-a';

describe('CardAdminA', () => {
  let component: CardAdminA;
  let fixture: ComponentFixture<CardAdminA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAdminA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAdminA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
