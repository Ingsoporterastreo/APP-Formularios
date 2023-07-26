import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PopoverController, NavController } from '@ionic/angular';

// Interfaces
import { Credenciales } from '../interfaces';
import { environment } from 'src/environments/environment';

// Servicios
import { StorageService } from './storage.service';
import { LoadingService } from './loading.service';

// Constantes
const URL = environment.url;

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private _logged_in = new BehaviorSubject<boolean>( false );

	constructor(
		private _http: HttpClient,
		private _loading_service: LoadingService,
		private _nav_controller: NavController,
		private _storage_service: StorageService,
	) { }

	/**
	 * Servicio que autentica el usuario y retorna el token con el usuario que será usado en el aplicativo
	 * @name			autenticarUsuario
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @param			{ Credenciales } credenciales
	 * 
	 * @returns
	*/
	autenticarUsuario( credenciales: Credenciales ): Observable< any > {
		const json = JSON.stringify( credenciales );
		const params = 'json=' + json;
		const headers = new HttpHeaders().set( 'Content-Type', 'application/x-www-form-urlencoded' );

		return this._http.post( `${URL}auth/autenticarUsuario`, params, {headers} );
	}

	/**
	 * Servicio que cierra sesión y redirige el usuario al login
	 * @name			cerrarSesion
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async cerrarSesion() {
		await this._loading_service.showLoading();
		await this._storage_service.clear();
		this.configurarSesion( false );
		await this._loading_service.dismiss();

		this._nav_controller.navigateRoot( '/login', {
			animated: true,
		});
	}

	/**
	 * Servicio que configura el valor de la sesión
	 * @name			configurarSesion
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	configurarSesion( valor: boolean ) {
		this._logged_in.next( valor );
	}

	/**
	 * Servicio que retorna un observable con un boolean si esta logueado
	 * @name			isLoggedIn
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @returns			{ Observable }
	*/
	get isLoggedIn() {
		return this._logged_in.asObservable();
	}

	/**
	 * Función que obtiene el token del storage de Ionic
	 * @name			obtenerToken
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @returns
	*/
	async obtenerToken() {
		const token = await this._storage_service.get( 'x-token' );

		if( token && token !== undefined ) {
			return token;
		} else {
			return null;
		}
	}
}
