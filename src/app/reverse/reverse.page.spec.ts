import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReversePage } from './reverse.page';

describe('ReversePage', () => {
  let component: ReversePage;
  let fixture: ComponentFixture<ReversePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReversePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
