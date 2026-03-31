import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarGlucosa } from './registrar-glucosa';

describe('RegistrarGlucosa', () => {
  let component: RegistrarGlucosa;
  let fixture: ComponentFixture<RegistrarGlucosa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarGlucosa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarGlucosa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
