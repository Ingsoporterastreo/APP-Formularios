import { Injectable, inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { NavController } from "@ionic/angular";

// Servicios
import { AuthService, StorageService } from "../services/services.index";

@Injectable({
	providedIn: 'root'
})
class LoginService {
	constructor(
		private _auth_service: AuthService,
		private _nav_controller: NavController,
		private _storage_service: StorageService,
	) {}
		
	async canActivate(): Promise< any > {
		const usuario = await this._storage_service.get( 'x-usuario' );

		if( !usuario ) {
			this._auth_service.configurarSesion( true );
			return true;
		} else {
			this._auth_service.configurarSesion( false );
			this._nav_controller.navigateRoot( '/main/tabs/home', {
				animated: true,
			});

			return false;
		}
	}
}

export const LoginGuard: CanActivateFn = (): any => {
	return inject( LoginService ).canActivate();
}