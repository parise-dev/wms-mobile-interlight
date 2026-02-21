import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VolumesPage } from './volumes.page';

const routes: Routes = [
  {
    path: 'id/:id',
    component: VolumesPage
  },
  {
    path: 'volumes-new',
    loadChildren: () => import('./volumes-new/volumes-new/volumes-new.module').then( m => m.VolumesNewPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VolumesPageRoutingModule {}
