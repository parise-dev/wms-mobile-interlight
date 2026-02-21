import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrintersPageRoutingModule } from './printers-routing.module';

import { PrintersPage } from './printers.page';
import { ReprintComponent } from './reprint/reprint.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrintersPageRoutingModule
  ],
  declarations: [PrintersPage, ReprintComponent]
})
export class PrintersPageModule {}
