import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolumesNewPage } from './volumes-new.page';

describe('VolumesNewPage', () => {
  let component: VolumesNewPage;
  let fixture: ComponentFixture<VolumesNewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumesNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
