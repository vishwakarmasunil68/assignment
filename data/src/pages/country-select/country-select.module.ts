import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountrySelectPage } from './country-select';

@NgModule({
  declarations: [
    CountrySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(CountrySelectPage),
  ],
})
export class CountrySelectPageModule {}
