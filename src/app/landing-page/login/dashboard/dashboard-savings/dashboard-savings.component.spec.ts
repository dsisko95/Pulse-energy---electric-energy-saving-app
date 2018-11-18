import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSavingsComponent } from './dashboard-savings.component';

describe('DashboardSavingsComponent', () => {
  let component: DashboardSavingsComponent;
  let fixture: ComponentFixture<DashboardSavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
