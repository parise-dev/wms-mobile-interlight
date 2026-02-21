import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickItemPage } from './pick-item.page';

describe('PickItemPage', () => {
  let component: PickItemPage;
  let fixture: ComponentFixture<PickItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PickItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
