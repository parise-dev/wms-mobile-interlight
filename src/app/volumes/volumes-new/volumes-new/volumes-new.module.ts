import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VolumesNewPageRoutingModule } from './volumes-new-routing.module';

import { VolumesNewPage } from './volumes-new.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    VolumesNewPageRoutingModule
  ],
  declarations: [VolumesNewPage]
})
export class VolumesNewPageModule {}
