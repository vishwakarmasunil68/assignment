import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPolicyPage } from './privacy-policy';

@NgModule({
  declarations: [
    PrivacyPolicyPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(PrivacyPolicyPage),
  ],
})
export class PrivacyPolicyPageModule {}
