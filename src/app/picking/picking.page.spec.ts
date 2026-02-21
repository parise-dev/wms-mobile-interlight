import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickingPage } from './picking.page';

describe('PickingPage', () => {
  let component: PickingPage;
  let fixture: ComponentFixture<PickingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
