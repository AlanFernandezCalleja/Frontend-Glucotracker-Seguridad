import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoShell } from './medico-shell';

describe('MedicoShell', () => {
  let component: MedicoShell;
  let fixture: ComponentFixture<MedicoShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicoShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
