import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaces
import { Inspection, ResultadoFormulario } from '../interfaces';
import { environment } from 'src/environments/environment';

// Constantes
const URL = environment.url;

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	constructor(
		private _http: HttpClient,
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
	guardarInspeccion( inspeccion: ResultadoFormulario ): Observable< any > {
		const json = JSON.stringify( inspeccion );
		const params = 'json=' + json;
		const headers = new HttpHeaders().set( 'Content-Type', 'application/x-www-form-urlencoded' );

		return this._http.post( `${URL}inspections/guardarInspeccion`, params, { headers } );
	}

	/**
	 * Servicio que obtiene las inspecciones del sistema
	 * @name			obtenerInspecciones
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @param			{ number } company_id
	 * 
	 * @returns
	*/
	obtenerInspecciones( company_id: number ): Observable< any > {
		return this._http.get( `${URL}inspections/company/${ company_id }` );
	}
	
	/**
	 * Servicio que obtiene el detalle de las inspecciones con las preguntas de cada formulario
	 * @name			obtenerDetalleInspecciones
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @param			{ number } inspeccion_id
	 * 
	 * @returns
	*/
	obtenerDetalleInspecciones( inspeccion_id: number ): Observable< any > {
		return this._http.get( `${URL}inspections/detail/${ inspeccion_id }` );
	}
	
	/**
	 * Servicio que obtiene las inspecciones con las preguntas de cada formulario
	 * @name			obtenerInspeccionesJSON
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @param			{ number } inspeccion_id
	 * 
	 * @returns
	*/
	obtenerInspeccionesJSON( inspeccion_id: number ): Observable< any > {
		return this._http.get( `${URL}inspections/${ inspeccion_id }` );
	}
}
