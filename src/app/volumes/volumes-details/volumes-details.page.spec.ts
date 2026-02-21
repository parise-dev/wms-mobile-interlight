import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolumesDetailsPage } from './volumes-details.page';

describe('VolumesDetailsPage', () => {
  let component: VolumesDetailsPage;
  let fixture: ComponentFixture<VolumesDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumesDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
