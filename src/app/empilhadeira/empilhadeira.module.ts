import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { IonicModule } from '@ionic/angular'
import { EmpilhadeiraComponent } from './empilhadeira.component';
import { EmpilhadeiraPageRoutingModule } from './empilhadeira-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpilhadeiraPageRoutingModule,
        NgxSpinnerModule
  ],
  declarations: [EmpilhadeiraComponent]
})
export class EmpilhadeiraPageModule {}
