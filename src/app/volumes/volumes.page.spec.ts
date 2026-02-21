import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolumesPage } from './volumes.page';

describe('VolumesPage', () => {
  let component: VolumesPage;
  let fixture: ComponentFixture<VolumesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
