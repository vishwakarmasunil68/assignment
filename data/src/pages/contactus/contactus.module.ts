import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactusPage } from './contactus';

@NgModule({
  declarations: [
    ContactusPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(ContactusPage),
  ],
})
export class ContactusPageModule {}
