import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CutsPage } from './cuts.page';

describe('CutsPage', () => {
  let component: CutsPage;
  let fixture: ComponentFixture<CutsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
