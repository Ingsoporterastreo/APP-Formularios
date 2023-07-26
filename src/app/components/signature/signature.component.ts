import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import SignaturePad from 'signature_pad';

@Component({
	selector: 'app-signature',
	templateUrl: './signature.component.html',
	styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent  implements OnInit, AfterViewInit {
	@ViewChild('canvas', { static: true }) elemento_signature: any;

	ancho = window.innerWidth;
	altura = window.innerHeight - 92;
	signature_pad: SignaturePad

	constructor(
		private _modal_controller: ModalController
	) { }

	ngOnInit() {}

	ngAfterViewInit(): void {
		this.signature_pad = new SignaturePad(this.elemento_signature.nativeElement);
		this.signature_pad.clear();
	}

	/**
	 * Metodo que cierra el modal y cancela la recolección de la firma
	 * @name			cancel
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	cancel() {
		this._modal_controller.dismiss( null, 'cancelar' );
	}

	/**
	 * Metodo que cierra el modal y envía los datos capturados en la firma
	 * @name			confirm
	 * @author			Santiago Ramírez Gaitán <santiagooo42@gmail.com>
	 * @version			1.0.0
	 * @access			public
	*/
	confirm() {
		const imagen = this.signature_pad.toDataURL();
		this._modal_controller.dismiss( imagen, 'confirmar' );
	}

}
