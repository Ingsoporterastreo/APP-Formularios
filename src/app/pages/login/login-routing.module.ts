import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Componentes
import { LoginPage } from "./login.page";

const routes: Routes = [
    {
        path: '',
        component: LoginPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginPageRoutingModule {}