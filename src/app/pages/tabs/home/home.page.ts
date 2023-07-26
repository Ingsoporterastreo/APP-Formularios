import { Component } from '@angular/core';

// Interfaces
import { Inspection, Usuario } from 'src/app/interfaces';

// Servicios
import { GlobalService, InspectionService, LoadingService, StorageService, UiService } from 'src/app/services/services.index';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss']
})
export class HomePage {
	fecha_actual: Date;
	inspecciones: Inspection[];
	usuario: Usuario;

	constructor(
		public global_service: GlobalService,
		private _inspection_service: InspectionService,
		private _loading_service: LoadingService,
		private _storage_service: StorageService,
		private _ui_service: UiService,
	) {
		this.fecha_actual = new Date();
		this.obtenerInformacionInicial();
	}

	/**
	 * Metodo que obtiene la información inicial para inicializar la vista
	 * @name			obtenerInformacionInicial
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async obtenerInformacionInicial() {
		await this._loading_service.showLoading();
		this.usuario = await this._storage_service.get( 'x-usuario' );
		this.obtenerInspecciones();
	}

	/**
	 * Metodo que consume el servicio para obtener inspecciones de la base de datos
	 * @name			obtenerInspecciones
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async obtenerInspecciones() {
		this._inspection_service.obtenerInspecciones( this.usuario.company_id ).subscribe(
			async res => {
				this.inspecciones = res;
				await this._loading_service.dismiss();
			},
			async error => {
				console.log(error);
				await this._ui_service.alertaInformativa( error );
				await this._loading_service.dismiss();
			}
		);
	}
}
