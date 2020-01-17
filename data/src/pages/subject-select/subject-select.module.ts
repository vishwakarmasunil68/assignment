import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubjectSelectPage } from './subject-select';

@NgModule({
  declarations: [
    SubjectSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(SubjectSelectPage),
  ],
})
export class SubjectSelectPageModule {}
