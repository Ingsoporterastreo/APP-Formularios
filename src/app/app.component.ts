import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

// Interfaces
import { OpcionMenu, Usuario } from './interfaces';

// Servicios
import { AuthService, DataService, StorageService } from './services/services.index';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
	usuario: Usuario;
	opciones_menu: Observable<OpcionMenu[]>;

	constructor(
		private _auth_service: AuthService,
		private _data_service: DataService,
		private _platform: Platform,
		private _storage_service: StorageService,
	) {}

	ngOnInit(): void {
		this.inicializarAplicacion();
		this.checkLogin();
	}

	/**
	 * Metodo que verifica si el usuario esta logueado
	 * 
	 * @name      inicializarAplicacion
	 * @author    Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version   1.0.0
	 * @access    private
	*/
	private checkLogin() {
		this._auth_service.isLoggedIn.subscribe( async valor => {
			if( valor ) {
				this.usuario = await this._storage_service.get( 'x-usuario' );
			}
		});
	}

	/**
	 * Metodo que inicializa las variables necesarias para mostrar la aplicación
	 * 
	 * @name      inicializarAplicacion
	 * @author    Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version   1.0.0
	 * @access    public
	*/
	inicializarAplicacion() {
		this._platform.ready().then( () => {
			this.opciones_menu = this._data_service.obtenerMenuOpciones();
		});
	}
}
