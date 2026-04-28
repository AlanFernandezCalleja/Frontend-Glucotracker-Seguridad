import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agregar } from './agregar';

describe('Agregar', () => {
  let component: Agregar;
  let fixture: ComponentFixture<Agregar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agregar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Agregar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
