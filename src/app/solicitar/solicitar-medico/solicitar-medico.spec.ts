import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarMedico } from './solicitar-medico';

describe('SolicitarMedico', () => {
  let component: SolicitarMedico;
  let fixture: ComponentFixture<SolicitarMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarMedico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
