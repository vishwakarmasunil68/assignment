import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import {NewAssignmentPage} from "../new-assignment/new-assignment";
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the ContactusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {

  // name:string="";
  // email:string="";
  // phone:string="";
  message:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public menuCtrl:MenuController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactusPage');
    // try{
    //     var parsedJSON=JSON.parse(window.localStorage.getItem(Constants.USER_LOGIN_DATA));
    //     this.name=parsedJSON.return_data.username;
    //     this.email=parsedJSON.return_data.email;
    //     this.phone=parsedJSON.return_data.phone;
    // }catch (e) {
    //   console.log("error:-"+e);
    // }
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

  submit():void{
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      var url = Constants.CONTACT_US;
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
      postdata.append('message', this.message);
      postdata.append('login_type', '1');

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));
          if (parsedData.status == "success") {

            this.presentToast(parsedData.message);
            this.message="";

          } else {
            this.presentToast(parsedData.message);
          }
        } catch (err) {
          console.log(err);
        }
      })


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
