import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonLoading } from '@ionic/angular';

import { PickItemPageRoutingModule } from './pick-item-routing.module';

import { PickItemPage } from './pick-item.page';
import { PickItemDetailComponent } from '../pick-item-detail/pick-item-detail.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    IonicModule,
    PickItemPageRoutingModule
  ],
  declarations: [PickItemPage,PickItemDetailComponent]
})
export class PickItemPageModule {}
