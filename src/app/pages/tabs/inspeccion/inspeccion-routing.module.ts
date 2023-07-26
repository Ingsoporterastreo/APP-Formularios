import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspeccionPage } from './inspeccion.page';

const routes: Routes = [
  {
    path: '',
    component: InspeccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspeccionPageRoutingModule {}
