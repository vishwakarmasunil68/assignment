import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {NewAssignmentPage} from "../new-assignment/new-assignment";

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {


  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public menuCtrl:MenuController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {

  }

  backView():void{
    this.viewCtrl.dismiss();
  }

  openMenu(){
    this.menuCtrl.open();
  }

  newAssignment():void{
    this.navCtrl.push(NewAssignmentPage);
  }


  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}
