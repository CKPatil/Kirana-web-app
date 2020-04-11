import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticContainerComponent } from './analytic-container.component';

describe('AnalyticContainerComponent', () => {
  let component: AnalyticContainerComponent;
  let fixture: ComponentFixture<AnalyticContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
