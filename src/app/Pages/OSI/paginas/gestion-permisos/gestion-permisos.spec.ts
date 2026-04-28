import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPermisos } from './gestion-permisos';

describe('GestionPermisos', () => {
  let component: GestionPermisos;
  let fixture: ComponentFixture<GestionPermisos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPermisos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPermisos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
