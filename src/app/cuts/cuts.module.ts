import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CutsPageRoutingModule } from './cuts-routing.module';

import { CutsPage } from './cuts.page';
import { CutItemPage } from './cut-item/cut-item.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CutsVolumeNewComponent } from './cuts-volume-new/cuts-volume-new.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CutsPageRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [CutsPage, CutItemPage, CutsVolumeNewComponent]
})
export class CutsPageModule {}
