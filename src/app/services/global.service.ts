import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {

	constructor() { }

	/**
	 * Metodo que retorna el nombre del mes
	 * @name			obtenerNombreMes
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	obtenerNombreMes( mes: number ) {
		switch ( mes ) {
			case 0:
				return 'Enero';
			case 1:
				return 'Febrero';
			case 2:
				return 'Marzo';
			case 3:
				return 'Abril';
			case 4:
				return 'Mayo';
			case 5:
				return 'Junio';
			case 6:
				return 'Julio';
			case 7:
				return 'Agosto';
			case 8:
				return 'Septiembre';
			case 9:
				return 'Octubre';
			case 10:
				return 'Noviembre';
			case 11:
				return 'Diciembre';
			default:
				return '';
		}
	}

	/**
	 * Metodo que retorna el nombre del día de la semana
	 * @name			obtenerNombreSemana
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	obtenerNombreSemana( dia: number ) {
		switch ( dia ) {
			case 1:
				return 'Lunes';
			case 2:
				return 'Martes';
			case 3:
				return 'Miercoles';
			case 4:
				return 'Jueves';
			case 5:
				return 'Viernes';
			case 6:
				return 'Sabado';
			case 0:
				return 'Domingo';
			default:
				return '';
		}
	}
}
