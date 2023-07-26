import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
	{
		path: 'tabs',
		component: TabsPage,
		children: [
			{
				path: 'herramientas',
				loadChildren: () => import('./herramientas/herramientas.module').then(m => m.HerramientasPageModule)
			},
			{
				path: 'home',
				loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
			},
			{
				path: 'inspeccion/:id',
				loadChildren: () => import('./inspeccion/inspeccion.module').then( m => m.InspeccionPageModule)
			},
			{
				path: '',
				redirectTo: '/main/tabs/home',
				pathMatch: 'full'
			}
		]
	},
	{
		path: '',
		redirectTo: '/main/tabs/home',
		pathMatch: 'full'
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
})

export class TabsPageRoutingModule {}
