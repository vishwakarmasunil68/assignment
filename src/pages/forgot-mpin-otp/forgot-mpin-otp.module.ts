import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotMpinOtpPage } from './forgot-mpin-otp';

@NgModule({
  declarations: [
    ForgotMpinOtpPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(ForgotMpinOtpPage),
  ],
})
export class ForgotMpinOtpPageModule {}
