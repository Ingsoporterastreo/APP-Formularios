// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	// url: 'http://localhost/wwwroot/public/api/',
	url: 'https://formularios.admintech.co/api/',
	// url_storage_pdf: 'http://localhost/wwwroot/public/storage/',
	url_storage_pdf: 'https://formularios.admintech.co/storage/',
	mensaje_error: 'Error. Por favor revise su conexión a internet e intentelo nuevamente.'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
