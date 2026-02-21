import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CutItemPage } from './cut-item.page';

describe('CutItemPage', () => {
  let component: CutItemPage;
  let fixture: ComponentFixture<CutItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CutItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
