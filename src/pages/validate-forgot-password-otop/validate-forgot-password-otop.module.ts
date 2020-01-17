import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValidateForgotPasswordOtopPage } from './validate-forgot-password-otop';

@NgModule({
  declarations: [
    ValidateForgotPasswordOtopPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(ValidateForgotPasswordOtopPage),
  ],
})
export class ValidateForgotPasswordOtopPageModule {}
