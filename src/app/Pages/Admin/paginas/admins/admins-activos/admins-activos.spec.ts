import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsActivos } from './admins-activos';

describe('AdminsActivos', () => {
  let component: AdminsActivos;
  let fixture: ComponentFixture<AdminsActivos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminsActivos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminsActivos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
