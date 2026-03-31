import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRegistros } from './mis-registros';

describe('MisRegistros', () => {
  let component: MisRegistros;
  let fixture: ComponentFixture<MisRegistros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisRegistros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisRegistros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
