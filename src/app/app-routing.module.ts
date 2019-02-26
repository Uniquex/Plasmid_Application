import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
//  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuardService] },
//  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule', canActivate: [AuthGuardService] },
    {path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule', canActivate: [AuthGuardService]},
    {path: 'details', loadChildren: './pages/details/details.module#DetailsPageModule'},
  { path: 'chart', loadChildren: './pages/chart/chart.module#ChartPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
