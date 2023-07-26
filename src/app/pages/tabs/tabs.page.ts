import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
	selector: 'app-tabs',
	templateUrl: 'tabs.page.html',
	styleUrls: ['tabs.page.scss']
})
export class TabsPage {

	constructor(
		private _menu_controller: MenuController,
	) {
		this._menu_controller.enable( true );
	}

}
