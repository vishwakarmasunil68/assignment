import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpiredAssignmentListPage } from './expired-assignment-list';

@NgModule({
  declarations: [
    ExpiredAssignmentListPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(ExpiredAssignmentListPage),
  ],
})
export class ExpiredAssignmentListPageModule {}
