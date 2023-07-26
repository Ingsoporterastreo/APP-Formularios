import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {
	loading: any;

	constructor(
		private _loading_controller: LoadingController
	) { }

	/**
	 * Metodo que configura las variables para presentar el loader
	 * @name			showLoading
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async showLoading() {
		this.loading = await this._loading_controller.create({
			cssClass: 'custom-loading',
			mode: 'ios',
			showBackdrop: false,
			spinner: 'dots',
			translucent: true,
		});

		this.loading.present();
	}

	/**
	 * Metodo que deja de mostrar el loader de carga
	 * @name			dismiss
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async dismiss() {
		await this.loading.dismiss();
	}
}
