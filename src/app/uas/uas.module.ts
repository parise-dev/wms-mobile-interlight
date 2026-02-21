import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UasPageRoutingModule } from './uas-routing.module';

import { UasPage } from './uas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UasPageRoutingModule
  ],
  declarations: [UasPage]
})
export class UasPageModule {}
