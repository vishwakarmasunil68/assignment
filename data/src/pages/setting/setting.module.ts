import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingPage } from './setting';

@NgModule({
  declarations: [
    SettingPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(SettingPage),
  ],
})
export class SettingPageModule {}
