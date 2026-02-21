import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackingListPage } from './packing-list.page';

describe('PackingListPage', () => {
  let component: PackingListPage;
  let fixture: ComponentFixture<PackingListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
