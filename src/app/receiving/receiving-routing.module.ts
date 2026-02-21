import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReceivingComponent } from './receiving.component';
import { LoadingComponent } from './loading/loading.component';
import { CanhotoComponent } from './canhoto/canhoto.component';


const routes: Routes = [
  {
    path: '',
    component: ReceivingComponent,
  },
  {
    path:'loading',
    component: LoadingComponent,
  },
  {
    path:'baixa',
    component: CanhotoComponent,
  },
  {
    path: 'receiving-item',
    loadChildren: () => import('./receiving-item/receiving-item.module').then( m => m.ReceivingItemPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})



export class ReceivingRoutingModule { }
