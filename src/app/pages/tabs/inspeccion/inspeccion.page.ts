import { App } from '@capacitor/app';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, IonModal, ModalController, NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NgForm } from '@angular/forms';

// Interfaces
import { Inspection, Respuesta, ResultadoFormulario, Usuario } from 'src/app/interfaces';

// Componentes
import { SignatureComponent } from 'src/app/components/signature/signature.component';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

// Servicios
import { InspectionService, LoadingService, StorageService, UiService } from 'src/app/services/services.index';

@Component({
	selector: 'app-inspeccion',
	templateUrl: './inspeccion.page.html',
	styleUrls: ['./inspeccion.page.scss'],
})
export class InspeccionPage implements OnInit, OnDestroy {
	@ViewChild(IonModal) modal: IonModal;
	@ViewChild('generalForm', { static: false }) generalForm: NgForm;
	
	bandera_inicial: boolean;
	imagen_firma: string | null;
	imagen_rescatada: string | null = null;
	informacion_qr: string;
	inspeccion_id: number;
	inspeccion: Inspection;
	nombre_formulario: string;
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
	scanner_activado: boolean;

	constructor(
		private _alert_controller: AlertController,
		private _inspection_service: InspectionService,
		private _modal_controller: ModalController,
		private _nav_controller: NavController,
		private _loading_service: LoadingService,
		private _route: ActivatedRoute,
		private _storage_service: StorageService,
		private _ui_service: UiService,
	) { }

	async ngOnInit() {
		this.bandera_inicial = false;

		// Se añade un listener para la app cuando se use la camara
		// Este listener devolvera la información de la imagen tomada cuando la app se crashea por el uso de la cámara
		App.addListener(
			'appRestoredResult',
			data => {
				if( data.pluginId == 'Camera' && data.success ) {
					this.imagen_rescatada = 'data:image/png;base64,' + data.data.base64String;
				}
			}
		);

		this.obtenerCoordenadasActuales();

		// this.obtenerInformacionInicial();
	}

	ngOnDestroy(): void {
		this.stopScanner();
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
		this.bandera_inicial = false;
		await this._loading_service.showLoading();

		const camara = await Camera.checkPermissions();
		const geolocalizacion = await Geolocation.checkPermissions();

		if( camara.camera == 'granted' && camara.photos == 'granted' && geolocalizacion.location == 'granted' ) {
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
				let bandera_requerido_input: boolean = false;
				let bandera_requerido_radio: boolean = false;

				this.keys.forEach( (key: any) => {
					bandera_requerido_input = false;
					bandera_requerido_radio = false;

					this.preguntas[key].forEach( (pregunta: any) => {
						if( pregunta.type == 'Input' ) {
							bandera_requerido_input = true;
						}
						if( pregunta.type == 'RadioButton' ) {
							bandera_requerido_radio = true;
						}

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

					this.preguntas[key].forEach( (pregunta: any) => {
						if( pregunta.type == 'Input' ) {
							pregunta.requerido = bandera_requerido_input && bandera_requerido_radio ? false : true;
						}
					});
				});

				// Setear las fotos que se encuentran guardadas en el storage
				const historial_fotos = await this._storage_service.get('x-historial-fotos');

				if( historial_fotos && historial_fotos.length > 0 ) {
					historial_fotos.forEach((element: any) => {
						this.keys.forEach( (key: any) => {
							this.preguntas[key].forEach( (pregunta: any) => {
								if( pregunta.id == element.pregunta_id ) {
									pregunta.respuesta = element.respuesta;
								}
							});	
						});
					});
				}

				// Validar si hay una imágen rescatada de un crash de la app
				if( this.imagen_rescatada ) {
					const id_pregunta = await this._storage_service.get('x-camera-id');

					this.keys.forEach( (key: any) => {
						this.preguntas[key].forEach( (pregunta: any) => {
							if( pregunta.id == id_pregunta ) {
								pregunta.respuesta = this.imagen_rescatada;
							}
						});	
					});

					this.imagen_rescatada = null;
				}

				this.bandera_inicial = true;

				// Verificar si hay un formulario guardado dentro de la memoria del celular
				const formulario = await this._storage_service.get( this.nombre_formulario );
				// Asignar los valores del formulario si se encuentra
				if( formulario && Object.keys(formulario).length > 0 ) {
					await this.generalForm.form.setValue(formulario);
				}

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
			const coordenadas = await Geolocation.getCurrentPosition();
			this.resultado_formulario.lat = coordenadas.coords.latitude;
			this.resultado_formulario.lon = coordenadas.coords.longitude;

			const usuario: Usuario = await this._storage_service.get( 'x-usuario' );
			this.inspeccion_id = params['id'];
			this.resultado_formulario.form_id = this.inspeccion_id;
			this.resultado_formulario.user_id = usuario.id;

			this.nombre_formulario = `x-formulario-${this.inspeccion_id}`;

			// Listener para saber cuando el formulario presenta algún tipo de cambio
			this.generalForm.form.valueChanges.subscribe( async formulario => {
				await this._storage_service.set(this.nombre_formulario, formulario);
			});	

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
	async onSubmit( generalForm: NgForm ) {
		await this._loading_service.showLoading();

		this.reiniciarRespuesta();
		let respuestas = [];
		let bandera_requerido_input: boolean = false;
		let bandera_requerido_radio: boolean = false;

		// Se valida si se tiene algubn campo con radio buttons y un input pues debería ser una justificación
		for (let i = 0; i < this.keys.length; i++) {
			bandera_requerido_input = false;
			bandera_requerido_radio = false;

			for (let j = 0; j < this.preguntas[this.keys[i]].length; j++) {
				switch (this.preguntas[this.keys[i]][j].type) {
					case 'Input':
						if( !this.preguntas[this.keys[i]][j].respuesta ) {
							bandera_requerido_input = true;
						}
						break;
					case 'RadioButton':
						this.preguntas[this.keys[i]][j].list.forEach( (lista: any) => {
							if( lista.title == 'SI' && lista.value == this.preguntas[this.keys[i]][j].respuesta ) {
								bandera_requerido_radio = true;
							}							
						});
						break;
					default:
						break;
				}
			}

			if( bandera_requerido_input && bandera_requerido_radio ) {
				this._ui_service.alertaInformativa( `Debe ingresar la justificación en la sección ${this.keys[i]}` );
				await this._loading_service.dismiss();
				return;
			} else {
			}
		}

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
				} else if( (!this.preguntas[this.keys[i]][j].respuesta || this.preguntas[this.keys[i]][j].respuesta == '') && this.preguntas[this.keys[i]][j].type == 'QR' ) {
					this._ui_service.alertaInformativa( `Debe escanear un QR válido para poder continuar` );
					await this._loading_service.dismiss();
					return;
				} else if( !this.preguntas[this.keys[i]][j].respuesta && this.preguntas[this.keys[i]][j].type == 'Input' && this.preguntas[this.keys[i]][j].requerido ) {
					this._ui_service.alertaInformativa( `Debe completar el campo ${this.preguntas[this.keys[i]][j].title}` );
					await this._loading_service.dismiss();
					return;
				} else if( !this.preguntas[this.keys[i]][j].respuesta && this.preguntas[this.keys[i]][j].type != 'Switch' && this.preguntas[this.keys[i]][j].type != 'QR' && this.preguntas[this.keys[i]][j].type != 'Draw' && this.preguntas[this.keys[i]][j].type != 'Input' ) {
					this._ui_service.alertaInformativa( `Debe completar el campo ${this.preguntas[this.keys[i]][j].title}` );
					await this._loading_service.dismiss();
					return;
				}
				this.respuesta.id = this.preguntas[this.keys[i]][j].id;
				this.respuesta.type = this.preguntas[this.keys[i]][j].type;
				switch (this.preguntas[this.keys[i]][j].type) {
					case 'Input':
						this.respuesta.response = this.preguntas[this.keys[i]][j].respuesta;
						respuestas.push( this.respuesta );
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
						this.respuesta.qrValue = this.preguntas[this.keys[i]][j].respuesta;
						respuestas.push( this.respuesta );
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
				await this._loading_service.dismiss();

				await this._ui_service.alertaInformativaPDF( 'Se ha guardado correctamente el formulario', res.pdf_name );

				// Eliminar los datos que se tienen transitorios del storage
				await this._storage_service.remove(this.nombre_formulario);
				await this._storage_service.remove('x-camera-id');
				await this._storage_service.remove('x-historial-fotos');

				// Reiniciar el formulario
				this.imagen_firma = null;
				generalForm.reset();
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
		// Almacenar el id de la foto en el storage del dispositivo
		this._storage_service.set('x-camera-id', pregunta.id);

		const imagen = await Camera.getPhoto({
			quality: 20,
			correctOrientation: true,
			allowEditing: false,
			resultType: CameraResultType.Base64,
			source: CameraSource.Camera
		});
		
		if( imagen ) {
			const imagen_seleccionada = 'data:image/png;base64,' + imagen.base64String;
			pregunta.respuesta = imagen_seleccionada;
			
			// Crear un objeto con la imagen para ser guardada en el storage
			const imagen_guardada = {
				pregunta_id: pregunta.id,
				respuesta: pregunta.respuesta
			}

			// Validar si el sotrage tiene historial de fotos
			let historial_fotos = await this._storage_service.get('x-historial-fotos');

			if( historial_fotos ) {
				let bandera = false;
				
				historial_fotos.forEach( (element: any) => {
					if( element.pregunta_id == pregunta.id ) {
						element.respuesta = pregunta.respuesta;
						bandera = true;
					}					
				});

				if( !bandera ) {
					historial_fotos.push( imagen_guardada );
				}
			} else {
				historial_fotos = [];
				historial_fotos.push( imagen_guardada );
			}

			// Guardar en el storage los valores de las imágenes guardadas
			await this._storage_service.set('x-historial-fotos', historial_fotos);
		}
	}

	/**
	 * Función que escanea un código QR con la camara del dispositivo
	 * @name			startScanner
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async startScanner( pregunta: any ) {
		document.body.style.background = 'transparent';
		pregunta.respuesta = '';
		const permisos = await this.verificarPermisosScanner();
		
		if( permisos ) {
			this.scanner_activado = true;
			BarcodeScanner.hideBackground();
	
			const result = await BarcodeScanner.startScan();
			if (result.hasContent) {
				pregunta.respuesta = result.content;
				this.stopScanner();
			}
		}

		// pregunta.respuesta = 'http://prueba.com';
	}

	/**
	 * Función que escanea un código QR con la camara del dispositivo
	 * @name			stopScanner
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async stopScanner() {
		this.scanner_activado = false;
		await BarcodeScanner.stopScan();
	}

	/**
	 * Función que le permite a la aplicación verificar los permisos de acceso a la camara
	 * @name			verificarPermisosScanner
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	async verificarPermisosScanner() {
		return new Promise( async(resolve, reject) => {
			const status = await BarcodeScanner.checkPermission({ force: true });

			if( status.granted ) {
				resolve( true );
			} else if( status.denied ) {
				const alert = await this._alert_controller.create({
					header: 'La aplicación no tiene permisos',
					message: 'Por favor, otorgue permisos a la camara en la configuración del sistema',
					buttons: [{
						text: 'Configuración',
						handler: () => {
							resolve( false );
							BarcodeScanner.openAppSettings();
						}
					}]
				});

				await alert.present();
			} else {
				resolve( false );
			}
		});
	}
}
