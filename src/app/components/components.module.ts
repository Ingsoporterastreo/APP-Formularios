import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

// Componentes
import { HeaderComponent } from './header/header.component';
import { PopoverInfoComponent } from './popover-info/popover-info.component';
import { PrincipalHeaderComponent } from './principal-header/principal-header.component';
import { ImageHeaderComponent } from './image-header/image-header.component';
import { SignatureComponent } from './signature/signature.component';

@NgModule({
	declarations: [
		HeaderComponent,
		ImageHeaderComponent,
		PopoverInfoComponent,
		PrincipalHeaderComponent,
		SignatureComponent
	],
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
	],
	exports: [
		HeaderComponent,
		ImageHeaderComponent,
		PopoverInfoComponent,
		PrincipalHeaderComponent,
		SignatureComponent
	]
})
export class ComponentsModule { }
