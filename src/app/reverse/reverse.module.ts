import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReversePageRoutingModule } from './reverse-routing.module';

import { ReversePage } from './reverse.page';
import { ReverseAllComponent } from './reverse-all/reverse-all.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReverseItemComponent } from './reverse-item/reverse-item/reverse-item.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    NgbModalModule,
    NgbModule,
    ReversePageRoutingModule
  ],
  declarations: [ReversePage, ReverseAllComponent, ReverseItemComponent, ReverseItemComponent]
})
export class ReversePageModule {}
