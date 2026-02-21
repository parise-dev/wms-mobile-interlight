import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VolumesDetailsPage } from './volumes-details.page';

const routes: Routes = [
  {
    path: '',
    component: VolumesDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VolumesDetailsPageRoutingModule {}
