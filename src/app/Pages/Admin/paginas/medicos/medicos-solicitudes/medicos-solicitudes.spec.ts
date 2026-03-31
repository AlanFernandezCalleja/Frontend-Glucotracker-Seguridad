import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicosSolicitudes } from './medicos-solicitudes';

describe('MedicosSolicitudes', () => {
  let component: MedicosSolicitudes;
  let fixture: ComponentFixture<MedicosSolicitudes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicosSolicitudes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicosSolicitudes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
