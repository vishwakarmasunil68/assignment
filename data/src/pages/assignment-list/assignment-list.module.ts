import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignmentListPage } from './assignment-list';

@NgModule({
  declarations: [
    AssignmentListPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(AssignmentListPage),
  ],
})
export class AssignmentListPageModule {}
