export interface Credenciales {
    email: 				string | null,
    password:           string | null,
}

export interface GeneralInfo {
    nombre_completo:    string | null,
    correo_electronico: string | null,
    password:           string | null,
    direccion:          string | null,
}

export interface Inspection {
	id:		 			number,
	name:				string,
	code:				number,
	notify:				number,
	description:		string,
	header:		 		string,
	user_id:		 	number,
	type_id:		 	number,
	company_id:		 	number,
	deleted_at:		 	number | null,
	created_at:		 	string,
	updated_at:		 	string,
}

export interface OpcionMenu {
    icon:               string,
    name:               string,
    url:                string,
}

export interface Respuesta {
	id: 				number | null,
	type:				string | null,
	response?:			string | null,
	draw?:				string | null,
	qrValue?: 			string | null,
	dateValue?:			string | null,
	value?: 			string | null,
	switchValue?: 		string | null,
	photo?: 			string | null,
	list?: 				any[] | null,
	observation?:		string | null,
	// photoAditional:		File | null,
}

export interface ResultadoFormulario {
	lat: 				number | null,
	lon: 				number | null,
	user_id:			number | null,
	form_id: 			number | null,
	form: 				Respuesta[] | any,
}

export interface Usuario {
	address: 			string,
	company_id:			number,
	created_at: 		string,
	email:				string,
	email_verif: 		boolean | null,
	id: 				number,
	name: 				string,
	phone: 				number,
	role: 				number,
	token_fcm: 			string,
	updated_at:			string,
}