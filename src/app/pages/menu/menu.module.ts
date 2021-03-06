import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MenuPage} from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'home', loadChildren: '../home/home.module#HomePageModule'},
      { path: 'settings', loadChildren: '../settings/settings.module#SettingsPageModule'},
      {path: 'details/:hostname', loadChildren: '../details/details.module#DetailsPageModule'},
      {path: 'details/chart/:hostname', loadChildren: '../chart/chart.module#ChartPageModule'},
      {path: 'details/processes/:hostname', loadChildren: '../processes/processes.module#ProcessesPageModule'}
    ]
  },
  {
    path: '',
    redirectTo: '/menu/home'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
