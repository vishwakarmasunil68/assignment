import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";
import {ValidateForgotPasswordOtopPage} from "../validate-forgot-password-otop/validate-forgot-password-otop";
import {BaseComp} from "../../utils/BaseComp";

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage{

  email: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  callAPI(): void {
    if (this.email != '') {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      var url = Constants.FORGOT_PASSWORD;
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');

      postdata.append('email', this.email);
      postdata.append('login_type', '1');

      this.printKeyValuePairs(url,postdata);

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));

          console.log("status:-"+parsedData.status);
          if (parsedData.status == "success") {
            this.presentToast(parsedData.message);
            window.localStorage.setItem(Constants.FORGOT_EMAIL, this.email);
            this.navCtrl.push(ValidateForgotPasswordOtopPage);
          } else {
            console.log("in else");
            this.presentToast(parsedData.message);
          }
        } catch (err) {
          console.log(err);
        }
      })
    } else {
      this.presentToast("Please Enter Details Properly");
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


  printKeyValuePairs(url: string, postdata) {
    console.log('url:-' + url);
    console.log('--------------FORM DATA---------------');
    let data = "";
    postdata.forEach((value, key) => {
      // console.log(key + ':' + value)
      data += key + ':' + value + "\n";
    });
    console.log(data);
    console.log('--------------FORM DATA---------------');
  }

}
