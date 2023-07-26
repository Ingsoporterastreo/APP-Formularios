import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

// Interfaces
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UiService {

	constructor(
		private _alert_controller: AlertController,
	) { }

	/**
	 * Servicio para mostrar una alerta informativa en el sistema
	 * @name				alertaInformativa
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async alertaInformativa( mensaje: string ) {
		const alert = await this._alert_controller.create({
			message: mensaje,
			buttons: ['OK']
		});

		await alert.present();
	}

	/**
	 * Servicio para mostrar una alerta informativa en el sistema con la opción de abrir un documento PDF
	 * @name			alertaInformativaPDF
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async alertaInformativaPDF( mensaje: string, nombre_pdf: string ) {
		const alert = await this._alert_controller.create({
			message: mensaje,
			buttons: [
				{
					text: 'Cerrar'
				},
				{
					text: 'Abrir PDF',
					handler: () => {
						window.open( `${ environment.url_storage_pdf }${ nombre_pdf }`, '_blank');
					}
				}
			]
		});

		await alert.present();
	}
}
