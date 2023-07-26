import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Guards
import { IdentityGuard, LoginGuard } from './guards/guards.index';

// Guards

const routes: Routes = [
	{
		path: 'main',
		loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule ),
		canActivate: [ IdentityGuard ]
	},
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule ),
		canActivate: [ LoginGuard ]
	},
	{
		path: '',
		pathMatch: 'full',
		// redirectTo: 'main',
		redirectTo: 'login',
	}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
