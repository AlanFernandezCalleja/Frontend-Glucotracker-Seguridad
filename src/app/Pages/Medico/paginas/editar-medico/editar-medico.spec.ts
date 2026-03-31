import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMedico } from './editar-medico';

describe('EditarMedico', () => {
  let component: EditarMedico;
  let fixture: ComponentFixture<EditarMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarMedico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
