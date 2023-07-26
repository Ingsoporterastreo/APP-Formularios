import { Injectable, inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { NavController } from "@ionic/angular";

// Servicios
import { AuthService, StorageService, UiService } from "../services/services.index";

@Injectable({
	providedIn: 'root'
})
class IdentityService {
	constructor(
		private _auth_service: AuthService,
		private _nav_controller: NavController,
		private _storage_service: StorageService,
		private _ui_service: UiService
	) {}

	/**
	 * Metodo que tiene la lógica para el guard y realzia las validaciones necesarias para su funcionamiento
	 * @name			canActivate
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @returns
	*/
	async canActivate(): Promise< any > {
		const usuario = await this._storage_service.get( 'x-usuario' );
		
		if( usuario ) {
			const fecha_vencimiento = new Date( await this._storage_service.get( 'x-expiration' ) ).getTime();
			const fecha_actual = new Date().getTime();

			if( fecha_actual <= fecha_vencimiento ) {
				this._auth_service.configurarSesion( true );
				return true;
			} else {
				await this._storage_service.clear();
				await this._ui_service.alertaInformativa( 'Se ha vencido la vigencia de su sesión, por favor, inicie sesión nuevamente' );
				this._auth_service.configurarSesion( false );
				this._nav_controller.navigateRoot( '/login', {
					animated: true
				});

				return false;
			}
		} else {
			this._auth_service.configurarSesion( false );
			this._nav_controller.navigateRoot( '/login', {
				animated: true
			});

			return false;
		}
	}
}

export const IdentityGuard: CanActivateFn = (): Promise< boolean > => {
	return inject( IdentityService ).canActivate();
}