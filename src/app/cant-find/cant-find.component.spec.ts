import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantFindComponent } from './cant-find.component';

describe('CantFindComponent', () => {
  let component: CantFindComponent;
  let fixture: ComponentFixture<CantFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
