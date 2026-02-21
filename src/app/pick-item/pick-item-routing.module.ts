import { PickItemDetailComponent } from './../pick-item-detail/pick-item-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickItemPage } from './pick-item.page';

const routes: Routes = [
  {
    path: ':id/:slpCode',
    component: PickItemPage
  },
  {
    path: 'detail/:absEntry/:lineNum/:objType',
    component: PickItemDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickItemPageRoutingModule {}
