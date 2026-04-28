import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsiShell } from './osi-shell';

describe('OsiShell', () => {
  let component: OsiShell;
  let fixture: ComponentFixture<OsiShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsiShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsiShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
