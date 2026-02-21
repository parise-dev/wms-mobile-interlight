import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UasPage } from './uas.page';

describe('UasPage', () => {
  let component: UasPage;
  let fixture: ComponentFixture<UasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
