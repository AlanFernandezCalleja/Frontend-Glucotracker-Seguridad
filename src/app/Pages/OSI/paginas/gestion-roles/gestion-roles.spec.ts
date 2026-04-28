import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRoles } from './gestion-roles';

describe('GestionRoles', () => {
  let component: GestionRoles;
  let fixture: ComponentFixture<GestionRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
