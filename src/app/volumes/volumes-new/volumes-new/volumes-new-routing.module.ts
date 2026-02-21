import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VolumesNewPage } from './volumes-new.page';

const routes: Routes = [
  {
    path: '',
    component: VolumesNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VolumesNewPageRoutingModule {}
