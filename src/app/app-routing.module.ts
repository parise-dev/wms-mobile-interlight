import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'receiving',
    loadChildren: () => import('./receiving/receiving.module').then(m => m.ReceivingModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'uas',
    loadChildren: () => import('./uas/uas.module').then( m => m.UasPageModule)
  },
  {
    path: 'inspection',
    loadChildren: () => import('./inspection/inspection.module').then( m => m.InspectionPageModule)
  },
  {
    path: 'packing-list',
    loadChildren: () => import('./packing-list/packing-list.module').then( m => m.PackingListPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {path: 'empilhadeira',
    loadChildren: () => import('./empilhadeira/empilhadeira.module').then(m => m.EmpilhadeiraPageModule)
  },
  {
    path: 'picking',
    loadChildren: () => import('./picking/picking.module').then( m => m.PickingPageModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'pick-item',
    loadChildren: () => import('./pick-item/pick-item.module').then( m => m.PickItemPageModule)
  },
  {
    path: 'volumes',
    loadChildren: () => import('./volumes/volumes.module').then( m => m.VolumesPageModule)
  },
  {
    path: 'printers',
    loadChildren: () => import('./printers/printers.module').then( m => m.PrintersPageModule)
  },
  {
    path: 'reverse',
    loadChildren: () => import('./reverse/reverse.module').then( m => m.ReversePageModule)
  },
  {
    path: 'cuts',
    loadChildren: () => import('./cuts/cuts.module').then( m => m.CutsPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
