import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspeccionPageRoutingModule } from './inspeccion-routing.module';

import { InspeccionPage } from './inspeccion.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
	ComponentsModule,
    FormsModule,
    IonicModule,
    InspeccionPageRoutingModule,
  ],
  declarations: [InspeccionPage]
})
export class InspeccionPageModule {}
