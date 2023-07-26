import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

// Interfaces
import { GeneralInfo, Usuario } from 'src/app/interfaces';

// Servicios
import { AuthService, LoadingService, StorageService } from 'src/app/services/services.index';

@Component({
  selector: 'app-herramientas',
  templateUrl: './herramientas.page.html',
  styleUrls: ['./herramientas.page.scss'],
})
export class HerramientasPage implements OnInit {
	usuario: Usuario;
	herramientas: string = 'general';

	constructor(
		private _auth_service: AuthService,
		private _loading_service: LoadingService,
		private _nav_controller: NavController,
		private _storage_service: StorageService
	) { }

	async ngOnInit() {
		await this._loading_service.showLoading();
		this.usuario = await this._storage_service.get( 'x-usuario' );
		await this._loading_service.dismiss();
	}

	/**
	 * Metodo que cierra sesión y redirige el usuario al login
	 * @name			cerrarSesion
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async cerrarSesion() {
		this._auth_service.cerrarSesion();
	}

	/**
	 * Metodo que recibe el evento onSubmit de la vista referente al segmento general
	 * @name        onSubmitGeneral
	 * @author      Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version     1.0.0
	 * @access      public
	*/
	onSubmitGeneral() {

	}

	/**
	 * Metodo que realiza el cambio del segmento
	 * @name        segmentChanged
	 * @author      Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version     1.0.0
	 * @access      public
	 * 
	 * @param       { Event } evento
	*/
	segmentChanged( evento: Event ) {
		this.herramientas = ( evento as CustomEvent ).detail.value;
	}
}
