import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninModule } from './sessions-routing.module';
import { SigninComponent } from './signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';



@NgModule({
  declarations: [SigninComponent],
  imports: [
    CommonModule,
    SigninModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonicModule
  ]
})
export class SessionsModule { }
