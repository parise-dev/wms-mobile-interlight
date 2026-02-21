import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintersPage } from './printers.page';
import { ReprintComponent } from './reprint/reprint.component';

const routes: Routes = [
  {
    path: '',
    component: PrintersPage
  },
  {
     path: 'reprint',
    component: ReprintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintersPageRoutingModule {}
