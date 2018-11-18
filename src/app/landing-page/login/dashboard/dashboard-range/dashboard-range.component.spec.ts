import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdvancedComponent } from './dashboard-range.component';

describe('DashboardAdvancedComponent', () => {
  let component: DashboardAdvancedComponent;
  let fixture: ComponentFixture<DashboardAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
