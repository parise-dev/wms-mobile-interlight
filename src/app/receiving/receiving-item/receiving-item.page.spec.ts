import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceivingItemPage } from './receiving-item.page';

describe('ReceivingItemPage', () => {
  let component: ReceivingItemPage;
  let fixture: ComponentFixture<ReceivingItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
