import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CutsPage } from './cuts.page';
import { CutItemPage } from './cut-item/cut-item.page';
import { CutsVolumeNewComponent } from './cuts-volume-new/cuts-volume-new.component';

const routes: Routes = [
  {
    path: '',
    component: CutsPage
  },
  {
    path: 'volume-new',
    component: CutsVolumeNewComponent
  },
  {
    path: 'cut-item/:id',
    component: CutItemPage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CutsPageRoutingModule {}
