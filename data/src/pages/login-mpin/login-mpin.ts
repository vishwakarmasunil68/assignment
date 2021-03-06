import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {HomePage} from "../home/home";
import * as Constants from "../../models/Constants";
import {ForgotMpinOtpPage} from "../forgot-mpin-otp/forgot-mpin-otp";
import {LoginCountrySelectPage} from "../login-country-select/login-country-select";

/**
 * Generated class for the LoginMpinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-mpin',
  templateUrl: 'login-mpin.html',
})
export class LoginMpinPage {

  mobile: string = "";
  mpin: string = "";

  countryList: Country[] = [];
  selectedCountry: Country = null;
  selectedCountryName: string = "Select Country";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    const callBackCountry: Country = {
      name: "India",
      dial_code: "+91",
      code: "IN"
    }
    this.selectedCountry = callBackCountry;
    this.selectedCountryName = callBackCountry.name + " ("+ callBackCountry.dial_code+")";
    console.log("dial code:-"+callBackCountry.dial_code);
  }

  openHomePage() {
    this.navCtrl.setRoot(HomePage).then(res => {
      // this.navCtrl.pop();
      // this.navCtrl.push(HomePage);
    });
  }

  forgotPassword(): void {
    this.navCtrl.push(ForgotMpinOtpPage);
  }

  openSelectCountryPage(): void {
    this.navCtrl.push(LoginCountrySelectPage, {
      callback: this.countryCallBackFunction
    });
  }

  countryCallBackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      console.log("data got:-" + JSON.stringify(_params));
      const callBackCountry: Country = {
        name: _params.name,
        dial_code: _params.dial_code,
        code: _params.code
      }
      this.selectedCountry = callBackCountry;
      this.selectedCountryName = callBackCountry.name + " ("+ callBackCountry.dial_code+")";
      console.log("dial code:-"+callBackCountry.dial_code);
      resolve();
    });
  }

  callLoginAPI(): void {
    if (this.mobile != '' || this.mpin != '') {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      var url = Constants.LOGIN_MPIN_URL;
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('mobile', this.selectedCountry.dial_code+this.mobile);
      postdata.append('mpin', this.mpin);
      postdata.append('login_type', '1');
      postdata.append('login_check', '1');

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));
          if (parsedData.status == "success") {
            this.presentToast(parsedData.message);
            window.localStorage.setItem(Constants.USER_LOGIN_DATA, JSON.stringify(result));
            window.localStorage.setItem(Constants.USER_ID, parsedData.return_data.id);
            window.localStorage.setItem(Constants.USER_LOGIN, "1");
            this.openHomePage();
          } else {
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

  openMpinPage(): void {
    this.navCtrl.push(LoginMpinPage);
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

interface Country {
  name: string;
  dial_code: string;
  code: string;
}
