import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

// Interfaces
import { Credenciales } from 'src/app/interfaces';

// Servicios
import { AuthService, InspectionService, LoadingService, StorageService, UiService } from 'src/app/services/services.index';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage  implements OnInit {
	credenciales: Credenciales;
	bandera_inicial: boolean;

	constructor(
		private _auth_service: AuthService,
		private _loading_service: LoadingService,
		private _menu_controller: MenuController,
		private _nav_controller: NavController,
		private _storage_service: StorageService,
		private _ui_service: UiService,

		private _inspection_service: InspectionService,
	) { }

	ngOnInit() {
		this.cargarInformacionInicial();
	}

	/**
	 * Metodo que carga la información inicial de la aplicación
	 * @name			cargarInformacionInicial
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @returns
	*/
	cargarInformacionInicial() {
		this.credenciales = {
			email: 				'prueba@escotur.com',
			password:           '12345',
		};

		this._menu_controller.enable( false );
		this.bandera_inicial = true;
	}

	/**
	 * Metodo que realiza el logueo del usuario en el aplicativo
	 * @name        iniciarSesion
	 * @author      Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version     1.0.0
	 * @access      public
	 */
	async iniciarSesion() {
		await this._loading_service.showLoading();
		
		this._auth_service.autenticarUsuario( this.credenciales ).subscribe(
			async res => {
				await this._storage_service.set( 'x-token', res.token );
				await this._storage_service.set( 'x-usuario', res.user );
				const expiration_time = new Date( new Date().getTime() + (6*60*60*1000) );
				await this._storage_service.set( 'x-expiration', expiration_time.toString() );
				await this._loading_service.dismiss();
				this._nav_controller.navigateRoot( 'main/tabs/home', {
					animated: true
				});
			},
			async error => {
				await this._ui_service.alertaInformativa( error );
				await this._loading_service.dismiss();
			}
		);
	}
}
