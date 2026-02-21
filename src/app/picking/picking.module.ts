import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickingPageRoutingModule } from './picking-routing.module';

import { PickingPage } from './picking.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    ToastrModule.forRoot({
    positionClass: 'toast-top-full-width',
    timeOut: 3000,
    closeButton: true
    }),
    PickingPageRoutingModule
  ],
  declarations: [PickingPage]
})
export class PickingPageModule {}
