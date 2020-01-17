import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashPage } from './splash';

@NgModule({
  declarations: [
    SplashPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(SplashPage),
  ],
})
export class SplashPageModule {}
