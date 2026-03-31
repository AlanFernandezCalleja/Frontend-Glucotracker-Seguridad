import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMedicoActivo } from './detalle-medico-activo';

describe('DetalleMedicoActivo', () => {
  let component: DetalleMedicoActivo;
  let fixture: ComponentFixture<DetalleMedicoActivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMedicoActivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleMedicoActivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
