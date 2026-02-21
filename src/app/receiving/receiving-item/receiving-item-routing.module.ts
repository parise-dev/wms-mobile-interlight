import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceivingItemPage } from './receiving-item.page';
import { ExpeditItemComponent } from '../expedit-item/expedit-item.component';

const routes: Routes = [
  {
    path: ':id',
    component: ReceivingItemPage
  },
  {
    path: ':id/expedit/:id2',
    component: ExpeditItemComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivingItemPageRoutingModule {}
