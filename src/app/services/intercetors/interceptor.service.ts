import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, from, lastValueFrom } from 'rxjs';

// Interfaces
import { environment } from 'src/environments/environment';

// Servicios
import { AuthService } from '../auth.service';
import { UiService } from '../ui.service';

@Injectable({
	providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

	constructor(
		private _auth_service: AuthService,
		private _ui_service: UiService
	) { }

	/**
	 * Función que maneja el interceptor de forma asincrona
	 * @name			handle
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version 		1.0.0
	 * @access			public
	 * 
	 * @param			{ HttpRequest } req
	 * @param			{ HttpHandler } next
	 * 
	 * @returns
	*/
	async handle( req: HttpRequest<any>, next: HttpHandler ) {
		const token: any = await this._auth_service.obtenerToken();
		
		let req_clone = req;
		if( token ) {
			// const headers = new HttpHeaders().set( 'Authorization', `Bearer ${token}` );
			
			// req_clone = req.clone({
			// 	headers: headers
			// });
		}
		return await lastValueFrom(
			next.handle( req_clone ).pipe(
				catchError( this.manejarError )
			)
		);
	}

	/**
	 * Función obligatoria del componente que hace el manejo de los errores y agrega los headers a las peticiones
	 * @name			InterceptorService
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version 		1.0.0
	 * @access			public
	 * 
	 * @param			{ HttpRequest } req
	 * @param			{ HttpHandler } next
	 * 
	 * @returns
	*/
	intercept( req: HttpRequest<any>, next: HttpHandler ): Observable< HttpEvent<any> > {
		return from( this.handle( req, next ) );
	}

	/**
	 * Función que maneja el error en todas las peticiones de la aplicación
	 * Se produce siempre un mensaje de error excepto cuando el servidor tenga a bamdera secondary
	 * Cuando esté activa la bandera secondary se maneja el mensaje de error con un alert en la vista
	 * @name			manejarError
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version 		1.0.0
	 * @access			public
	 * 
	 * @param			{ HttpErrorResponse } error
	 * 
	 * @returns
	*/
	manejarError( error: HttpErrorResponse ) {
		console.log( error );
		let message = environment.mensaje_error;

		if( error && error.error ) {
			if( error.error.status ) {
				const estado = error.error.status;
				
				switch (estado) {
					case "login_error":
						message = 'Su usuario o contraseña son incorrectos';
						break;
					default:
						break;
				}
			}
		}

		return throwError( message );
	}
}
