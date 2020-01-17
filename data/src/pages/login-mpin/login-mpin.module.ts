import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginMpinPage } from './login-mpin';

@NgModule({
  declarations: [
    LoginMpinPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(LoginMpinPage),
  ],
})
export class LoginMpinPageModule {}
