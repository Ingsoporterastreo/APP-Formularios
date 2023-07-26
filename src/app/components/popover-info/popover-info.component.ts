import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';

// Servicios
import { AuthService, StorageService } from 'src/app/services/services.index';

@Component({
	selector: 'app-popover-info',
	templateUrl: './popover-info.component.html',
	styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent  implements OnInit {

	constructor(
		private _auth_service: AuthService,
		private _popover_controller: PopoverController,
	) { }

	ngOnInit() {}

	/**
	 * Metodo que cierra sesión y redirige el usuario al login
	 * @name			cerrarSesion
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async cerrarSesion() {
		this._auth_service.cerrarSesion();
		this._popover_controller.dismiss({});
	}
}
