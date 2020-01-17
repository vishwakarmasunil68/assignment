import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RationModalPage } from './ration-modal';

@NgModule({
  declarations: [
    RationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(RationModalPage),
  ],
})
export class RationModalPageModule {}
