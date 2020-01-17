import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as Constants from "../../models/Constants";
import {LoginPage} from "../login/login";

/**
 * Generated class for the ResetMpinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-mpin',
  templateUrl: 'reset-mpin.html',
})
export class ResetMpinPage {

  new_mpin: string = "";
  confirm_mpin: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  callAPI(): void {
    if (this.new_mpin != '' || this.confirm_mpin != '') {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      var url = Constants.RESET_MPIN;
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('mobile', window.localStorage.getItem(Constants.FORGOT_MOBILE));
      postdata.append('mpin', this.new_mpin);
      postdata.append('mpin_confirm', this.confirm_mpin);
      postdata.append('login_type', '1');

      console.log("user_id:-" + JSON.stringify(postdata.getAll("mobile")));

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));
          if (parsedData.status == "success") {
            this.presentToast(parsedData.message);
            this.navCtrl.setRoot(LoginPage);
          } else {
            this.presentToast(parsedData.message);
          }
        } catch (err) {
          console.log(err);
        }
      })
    } else {
      this.presentToast("Please Enter Fields Properly");
    }
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

