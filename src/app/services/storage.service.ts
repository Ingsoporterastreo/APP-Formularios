import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	private storage: Storage | null;

	constructor(
		private _storage: Storage,
	) {
		this.init();
	}

	/**
	 * Limpia todas las variables del Storage
	 * @name			clear
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async clear() {
		await this.storage?.clear();
	}

	/**
	 * Obtiene una variable almacenada en el Storage
	 * @name			get
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @param 			{ string } key
	*/
	async get( key: string ): Promise<any> {
		return await this.storage?.get( key );
	}

	/**
	 * Inicializa las variables iniciales para el funcionamiento del Storage
	 * @name			init
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async init() {
		const storage = await this._storage.create();
		this.storage = storage;
	}

	/**
	 * Elimina la variable ingresada por el usuario
	 * @name			remove
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @param 			{ string } key
	*/
	async remove( key: string ) {
		await this.storage?.remove( key );
	}

	/**
	 * Guarda las variables ingresadas por el usuario en el Storage
	 * @name			set
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @param 			{ string } key
	 * @param 			{ any } value
	*/
	async set( key: string, value: any ) {
		await this.storage?.set( key, value );
	}
}
