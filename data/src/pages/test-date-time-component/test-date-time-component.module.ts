import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestDateTimeComponentPage } from './test-date-time-component';

@NgModule({
  declarations: [
    TestDateTimeComponentPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(TestDateTimeComponentPage),
  ],
})
export class TestDateTimeComponentPageModule {}
