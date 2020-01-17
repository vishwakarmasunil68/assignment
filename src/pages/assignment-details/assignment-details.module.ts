import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignmentDetailsPage } from './assignment-details';

@NgModule({
  declarations: [
    AssignmentDetailsPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(AssignmentDetailsPage),
  ],
})
export class AssignmentDetailsPageModule {}
