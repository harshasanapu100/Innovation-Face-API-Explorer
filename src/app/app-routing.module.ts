import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { FaceTesterComponent } from './face-tester/face-tester.component';

import { AuthGuard } from './helpers/auth.guard'

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // , canActivate: [AuthGuard]
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
  //{ path: '', component: HomeComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'shopping', component: ShoppingComponent },
  { path: 'test-faces', component: FaceTesterComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
