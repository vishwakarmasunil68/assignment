import { ModalController } from 'ionic-angular';
import {TicketClosePage} from "../ticket-close/ticket-close";

export class MyPage {

  constructor(public modalCtrl: ModalController) { }

  presentModal() {
    const modal = this.modalCtrl.create(TicketClosePage);
    modal.present();
  }
}
