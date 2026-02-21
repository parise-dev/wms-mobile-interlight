import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceivingItemPageRoutingModule } from './receiving-item-routing.module';

import { ReceivingItemPage } from './receiving-item.page';
import { ExpeditItemComponent } from '../expedit-item/expedit-item.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    IonicModule,
    ReceivingItemPageRoutingModule
  ],
  declarations: [ReceivingItemPage, ExpeditItemComponent]
})
export class ReceivingItemPageModule {}
