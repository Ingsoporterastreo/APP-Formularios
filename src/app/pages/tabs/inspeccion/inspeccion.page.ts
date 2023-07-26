import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { IonModal, ModalController, NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Interfaces
import { Inspection, Respuesta, ResultadoFormulario, Usuario } from 'src/app/interfaces';

// Servicios
import { InspectionService, LoadingService, StorageService, UiService } from 'src/app/services/services.index';
import { SignatureComponent } from 'src/app/components/signature/signature.component';

@Component({
	selector: 'app-inspeccion',
	templateUrl: './inspeccion.page.html',
	styleUrls: ['./inspeccion.page.scss'],
})
export class InspeccionPage implements OnInit {
	@ViewChild(IonModal) modal: IonModal;

	imagen_firma: string;
	inspeccion_id: number;
	inspeccion: Inspection;
	preguntas: any;
	keys: any;
	respuesta: Respuesta;
	resultado_formulario: ResultadoFormulario = {
		lat: null,
		lon: null,
		user_id: null,
		form_id:  null,
		form: [],
	};

	prueba: any;

	constructor(
		private _inspection_service: InspectionService,
		private _modal_controller: ModalController,
		private _nav_controller: NavController,
		private _loading_service: LoadingService,
		private _route: ActivatedRoute,
		private _storage_service: StorageService,
		private _ui_service: UiService,
	) { }

	ngOnInit() {
		this.obtenerCoordenadasActuales();
	}

	/**
	 * Función que realiza la apertura del modal para firmar
	 * @name			abrirModalFirma
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async abrirModalFirma() {
		const modal = await this._modal_controller.create({
			component: SignatureComponent,
		});		

		await modal.present();

		const data = await modal.onWillDismiss();
		this.imagen_firma = data.data;
	}

	/**
	 * Metodo que obtiene las coordenadas del celular al momento de acceder a la app
	 * @name			obtenerCoordenadasActuales
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async obtenerCoordenadasActuales() {
		await this._loading_service.showLoading();

		const camara = await Camera.checkPermissions();
		const geolocalizacion = await Geolocation.checkPermissions();

		if( camara.camera == 'granted' && camara.photos == 'granted' && geolocalizacion.location == 'granted' ) {
			const coordenadas = await Geolocation.getCurrentPosition();
			this.resultado_formulario.lat = coordenadas.coords.latitude;
			this.resultado_formulario.lon = coordenadas.coords.longitude;

			this.obtenerInformacionInicial();
		} else {
			let mensaje = null;
			const permisos_camara = await Camera.requestPermissions();
			const geolocalizacion = await Geolocation.requestPermissions();

			if( permisos_camara.camera != 'granted' ) {
				mensaje = 'La aplicación debe tener permisos a la camara para poder llenar los formularios';
			} else if( permisos_camara.photos != 'granted' ) {
				mensaje = 'La aplicación debe tener permisos al carrete de fotos para poder llenar los formularios';
			} else if( geolocalizacion.location != 'granted' ) {
				mensaje = 'Debe darle permisos de localización a la aplicación para poder llenar los formularios';
			}
			if( mensaje ) {
				await this._loading_service.dismiss();
				await this._ui_service.alertaInformativa( mensaje );
				this._nav_controller.navigateRoot( '/main/tabs/home', {
					animated: true,
				});
			} else {
				this.obtenerInformacionInicial();
			}
		}
	}

	/**
	 * Metodo que obtiene el detalle de las inspecciones segun el id
	 * @name			obtenerDetalleInspecciones
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	obtenerDetalleInspecciones() {
		this._inspection_service.obtenerDetalleInspecciones( this.inspeccion_id ).subscribe(
			async res => {
				this.inspeccion = res.inspection;
				this.preguntas = res.question;
				this.keys = Object.keys( this.preguntas );
				this.keys.forEach( (key: any) => {
					this.preguntas[key].forEach( (pregunta: any) => {
						if( pregunta.type == 'Checkbox' ) {
							pregunta.list.forEach( (check: any) => {
								check.respuesta = null;								
							});
						} else if( pregunta.type == 'Switch' ) {
							pregunta.respuesta = false;
						} else {
							pregunta.respuesta = null;						
						}
					});	
				});

				await this._loading_service.dismiss();
			},
			async error => {
				console.log(error);
				await this._loading_service.dismiss();
			}
		)
	}

	/**
	 * Metodo que obtiene la información inicial para inicializar la vista
	 * @name			obtenerInformacionInicial
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	obtenerInformacionInicial() {
		this._route.params.subscribe( async params => {
			const usuario: Usuario = await this._storage_service.get( 'x-usuario' );
			this.inspeccion_id = params['id'];
			this.resultado_formulario.form_id = this.inspeccion_id;
			this.resultado_formulario.user_id = usuario.id;

			this.obtenerDetalleInspecciones();
		});
	}

	/**
	 * Metodo que recive el evento guardar de la vista y permite la apertura del PDF
	 * @name			onSubmit
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async onSubmit() {
		await this._loading_service.showLoading();

		this.reiniciarRespuesta();
		let respuestas = [];

		for (let i = 0; i < this.keys.length; i++) {
			for (let j = 0; j < this.preguntas[this.keys[i]].length; j++) {
				if( this.preguntas[this.keys[i]][j].type == 'Checkbox') {
					let bandera = false;
					this.preguntas[this.keys[i]][j].list.forEach( (lista: any) => {
						if( lista.respuesta ) {
							bandera = true;
						}						
					});
					if( !bandera ) {
						this._ui_service.alertaInformativa( `Debe seleccionar al menos una respuesta del campo ${this.preguntas[this.keys[i]][j].title}` );
						await this._loading_service.dismiss();
						return;
					}
				} else if( !this.imagen_firma && this.preguntas[this.keys[i]][j].type == 'Draw' ) {
					this._ui_service.alertaInformativa( `Debe firmar el formulario para poder continuar` );
					await this._loading_service.dismiss();
					return;
				} else if( !this.preguntas[this.keys[i]][j].respuesta && this.preguntas[this.keys[i]][j].type != 'Switch' && this.preguntas[this.keys[i]][j].type != 'QR' && this.preguntas[this.keys[i]][j].type != 'Draw' ) {
					this._ui_service.alertaInformativa( `Debe completar el campo ${this.preguntas[this.keys[i]][j].title}` );
					await this._loading_service.dismiss();
					return;
				}
				this.respuesta.id = this.preguntas[this.keys[i]][j].id;
				this.respuesta.type = this.preguntas[this.keys[i]][j].type;
				switch (this.preguntas[this.keys[i]][j].type) {
					case 'Input':
						if( this.keys[i] == 'OBSERVACIONES' ) {
							this.respuesta.observation = this.preguntas[this.keys[i]][j].respuesta;
						} else {
							this.respuesta.response = this.preguntas[this.keys[i]][j].respuesta;
							respuestas.push( this.respuesta );
						}
						break;
					case 'RadioButton':
						this.respuesta.value = this.preguntas[this.keys[i]][j].respuesta;
						respuestas.push( this.respuesta );
						break;
					case 'Switch':
						this.respuesta.switchValue = this.preguntas[this.keys[i]][j].respuesta ? '1' : '0';
						respuestas.push( this.respuesta );
						break;
					case 'Checkbox':
						this.respuesta.list = this.preguntas[this.keys[i]][j].list;
						this.respuesta.list?.forEach( lista => {
							if( lista.respuesta ) {
								lista.value = '1';
							} else {
								lista.value = '0';
							}
						});
						respuestas.push( this.respuesta );
						break;
					case 'Date':
						this.respuesta.dateValue = this.preguntas[this.keys[i]][j].respuesta.split('T')[0];
						respuestas.push( this.respuesta );
						break;
					case 'File':
						this.respuesta.photo = this.preguntas[this.keys[i]][j].respuesta;
						this.respuesta.photo = this.respuesta.photo?.replace( 'data:image/png;base64,', '' );
						respuestas.push( this.respuesta );
						break;
					case 'Number':
						this.respuesta.response = this.preguntas[this.keys[i]][j].respuesta;
						respuestas.push( this.respuesta );
						break;
					case 'QR':
						// this.respuesta.qrValue = this.preguntas[this.keys[i]][j].respuesta;
						// respuestas.push( this.respuesta );
						break;
					case 'Draw':
						this.respuesta.draw = this.imagen_firma;
						this.respuesta.draw = this.respuesta.draw?.replace( 'data:image/png;base64,', '' );
						respuestas.push( this.respuesta );
						break;
					case 'Select':
						this.respuesta.response = this.preguntas[this.keys[i]][j].respuesta;
						respuestas.push( this.respuesta );
						break;
					case 'Authorization':
						this.respuesta.response = this.preguntas[this.keys[i]][j].respuesta;
						respuestas.push( this.respuesta );
						break;
					default:
						break;
				}
				this.reiniciarRespuesta();
			}			
		}
		this.resultado_formulario.form = respuestas;

		// Guardar la respuesta usando el servicio con las respuestas construidas
		this._inspection_service.guardarInspeccion( this.resultado_formulario ).subscribe(
			async res => {
				await this._ui_service.alertaInformativaPDF( 'Se ha guardado correctamente el formulario', res.pdf_name );
				await this._loading_service.dismiss();

				this._nav_controller.navigateRoot( '/main/tabs/home', {
					animated: true,
				});

			},
			async error => {
				this._ui_service.alertaInformativa( error );
				await this._loading_service.dismiss();
			}
		);
	}

	/**
	 * Función que reinicia los valores de la respuesta
	 * @name			reiniciarRespuesta
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	reiniciarRespuesta() {
		this.respuesta = {
			id: null,
			type: null
			// photoAditional: null,
		}
	}

	/**
	 * Función que abre la camara o la galería para seleccionar una foto
	 * @name			seleccionarFotoGaleria
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	 * 
	 * @param			{ any } pregunta
	*/
	async seleccionarFotoGaleria( pregunta: any ){
		const imagen = await Camera.getPhoto({
			quality: 100,
			correctOrientation: true,
			allowEditing: false,
			resultType: CameraResultType.Base64,
			source: CameraSource.Camera
		});

		const imagen_seleccionada = 'data:image/png;base64,' + imagen.base64String;
		pregunta.respuesta = imagen_seleccionada;
	}
}
