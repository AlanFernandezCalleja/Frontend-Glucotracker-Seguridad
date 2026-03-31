import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetalle } from './admin-detalle';

describe('AdminDetalle', () => {
  let component: AdminDetalle;
  let fixture: ComponentFixture<AdminDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
