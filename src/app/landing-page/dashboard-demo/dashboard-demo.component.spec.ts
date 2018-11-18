import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDemoComponent } from './dashboard-demo.component';

describe('DashboardDemoComponent', () => {
  let component: DashboardDemoComponent;
  let fixture: ComponentFixture<DashboardDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
