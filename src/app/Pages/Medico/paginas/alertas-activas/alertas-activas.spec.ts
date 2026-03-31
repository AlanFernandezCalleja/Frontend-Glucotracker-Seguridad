import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasActivas } from './alertas-activas';

describe('AlertasActivas', () => {
  let component: AlertasActivas;
  let fixture: ComponentFixture<AlertasActivas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasActivas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertasActivas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
