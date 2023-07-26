import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

// Controlador
import { PopoverInfoComponent } from '../popover-info/popover-info.component';

@Component({
  selector: 'app-principal-header',
  templateUrl: './principal-header.component.html',
  styleUrls: ['./principal-header.component.scss'],
})
export class PrincipalHeaderComponent  implements OnInit {

	constructor(
		private _popover_controller: PopoverController,
	) { }

	ngOnInit() {}

	async presentPopover( event: any ) {
		const popover = await this._popover_controller.create({
			component: PopoverInfoComponent,
			event,
			translucent: true,
			backdropDismiss: true,
		});

		await popover.present();
	}
}
