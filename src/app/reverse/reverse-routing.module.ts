import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReversePage } from './reverse.page';
import { ReverseAllComponent } from './reverse-all/reverse-all.component';
import { ReverseItemComponent } from './reverse-item/reverse-item/reverse-item.component';

const routes: Routes = [
  {
    path: 'list',
    component: ReversePage
  },
  {
    path: 'docnum/:id',
    component: ReverseAllComponent
  },
  {
    path: 'docn/:id/volume/:id2',
    component: ReverseItemComponent
  },
  {
    path: 'all',
    component: ReverseAllComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReversePageRoutingModule {}
