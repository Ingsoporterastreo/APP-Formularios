import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HerramientasPageRoutingModule } from './herramientas-routing.module';

import { HerramientasPage } from './herramientas.page';

// Componentes
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    HerramientasPageRoutingModule
  ],
  declarations: [HerramientasPage]
})
export class HerramientasPageModule {}
