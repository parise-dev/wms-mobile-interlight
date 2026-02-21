import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceivingRoutingModule } from './receiving-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReceivingComponent } from './receiving.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingComponent } from './loading/loading.component';
import { CanhotoComponent } from './canhoto/canhoto.component';



@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    FormsModule,
    IonicModule,
    ReceivingRoutingModule
  ],
  declarations: [ReceivingComponent,LoadingComponent, CanhotoComponent]
})
export class ReceivingModule { }
