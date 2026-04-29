import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicosActivos } from './medicos-activos';

describe('MedicosActivos', () => {
  let component: MedicosActivos;
  let fixture: ComponentFixture<MedicosActivos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicosActivos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicosActivos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
