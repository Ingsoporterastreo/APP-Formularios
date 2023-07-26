import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

// Interfaces
import { OpcionMenu } from "../interfaces";

@Injectable({
    providedIn: 'root'
})

export class DataService {

    constructor(
        private _http: HttpClient,
    ) {}
    /**
     * Servicio que obtiene un archivo json con las opciones del menú
     * 
     * @name            obtenerMenuOpciones
     * @author          Santiago Ramírez Gaitán <santiagooo42@gmail.com>
     * @version         1.0.0
     * @access          public
     * 
     * @returns
    */
    obtenerMenuOpciones(): Observable<any> {
        return this._http.get<OpcionMenu[]>('/assets/data/opciones-menu.json');
    }
}