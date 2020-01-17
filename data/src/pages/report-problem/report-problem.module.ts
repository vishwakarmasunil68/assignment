import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportProblemPage } from './report-problem';

@NgModule({
  declarations: [
    ReportProblemPage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(ReportProblemPage),
  ],
})
export class ReportProblemPageModule {}
