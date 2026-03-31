import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasResueltas } from './alertas-resueltas';

describe('AlertasResueltas', () => {
  let component: AlertasResueltas;
  let fixture: ComponentFixture<AlertasResueltas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasResueltas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertasResueltas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
