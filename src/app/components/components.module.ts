import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadBarComponent } from './loadBar/loadBar.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [LoadBarComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [LoadBarComponent]
})
export class ComponentsModule { }
