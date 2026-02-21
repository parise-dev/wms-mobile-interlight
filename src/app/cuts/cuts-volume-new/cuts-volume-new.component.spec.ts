import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CutsVolumeNewComponent } from './cuts-volume-new.component';

describe('CutsVolumeNewComponent', () => {
  let component: CutsVolumeNewComponent;
  let fixture: ComponentFixture<CutsVolumeNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CutsVolumeNewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CutsVolumeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
