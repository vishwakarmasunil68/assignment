import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginCountrySelectPage } from './login-country-select';

@NgModule({
  declarations: [
    LoginCountrySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginCountrySelectPage),
  ],
})
export class LoginCountrySelectPageModule {}
