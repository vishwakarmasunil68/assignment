import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UniversitySelectPage } from './university-select';

@NgModule({
  declarations: [
    UniversitySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(UniversitySelectPage),
  ],
})
export class UniversitySelectPageModule {}
