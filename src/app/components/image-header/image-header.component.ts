import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverInfoComponent } from '../popover-info/popover-info.component';

@Component({
	selector: 'app-image-header',
	templateUrl: './image-header.component.html',
	styleUrls: ['./image-header.component.scss'],
})
export class ImageHeaderComponent  implements OnInit {

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
