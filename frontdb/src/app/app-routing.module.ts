import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { MenuprincipalComponent } from './component/menuprincipal/menuprincipal.component';

const routes: Routes = [
 { path: '', component: LoginComponent },
 { path: 'login', component: LoginComponent },
 { path: 'menuprincipal', component: MenuprincipalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
