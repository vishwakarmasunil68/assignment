import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValidateForgotMpinOtpPage } from './validate-forgot-mpin-otp';

@NgModule({
  declarations: [
    ValidateForgotMpinOtpPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(ValidateForgotMpinOtpPage),
  ],
})
export class ValidateForgotMpinOtpPageModule {}
