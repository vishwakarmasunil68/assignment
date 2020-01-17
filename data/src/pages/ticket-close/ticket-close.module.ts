import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketClosePage } from './ticket-close';

@NgModule({
  declarations: [
    TicketClosePage,
  ],
  imports: [ 
    FormsModule,  

    IonicPageModule.forChild(TicketClosePage),
  ],
})
export class TicketClosePageModule {}
