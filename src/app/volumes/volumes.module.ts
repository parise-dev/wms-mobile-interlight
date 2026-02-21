import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VolumesPageRoutingModule } from './volumes-routing.module';

import { VolumesPage } from './volumes.page';
import { VolumesDetailsPage } from './volumes-details/volumes-details.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { VolumesNewPage } from './volumes-new/volumes-new/volumes-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    VolumesPageRoutingModule
  ],
  declarations: [VolumesPage, VolumesDetailsPage]
})
export class VolumesPageModule {}
