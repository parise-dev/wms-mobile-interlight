import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VolumesDetailsPageRoutingModule } from './volumes-details-routing.module';

import { VolumesDetailsPage } from './volumes-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VolumesDetailsPageRoutingModule
  ],
  declarations: [VolumesDetailsPage]
})
export class VolumesDetailsPageModule {}
