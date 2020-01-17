import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetMpinPage } from './reset-mpin';

@NgModule({
  declarations: [
    ResetMpinPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(ResetMpinPage),
  ],
})
export class ResetMpinPageModule {}
