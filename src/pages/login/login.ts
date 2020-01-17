import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
import * as Constants from '../../models/Constants';
import {HttpClient} from "@angular/common/http";
import {LoginMpinPage} from "../login-mpin/login-mpin";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // email: string = "sundroid1993@gmail.com";
  // password: string = "digi@123";

  email: string = "";
  password: string = "";
  password_type: string = "password";
  showPass: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.email=window.localStorage.getItem(Constants.SAVED_LOGIN_USER_ID);
  }

  openHomePage() {
    this.navCtrl.setRoot(HomePage).then(res => {
      // this.navCtrl.pop();
      // this.navCtrl.push(HomePage);
    });
  }

  forgotPassword(): void {
    this.navCtrl.push(ForgotPasswordPage);
  }

  callLoginAPI(): void {
    if (this.email != '' || this.password != '') {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      console.log("device token:-" + window.localStorage.getItem(Constants.DEVICE_TOKEN));

      var url = Constants.LOGIN_URL;
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('username', this.email);
      postdata.append('password', this.password);
      postdata.append('login_type', '1');
      postdata.append('login_check', '1');

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));
          if (parsedData.status == "success") {

            console.log("user_id:-" + parsedData.return_data.id);
            window.localStorage.setItem(Constants.SAVED_LOGIN_USER_ID,this.email);
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

  showHide(): void {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.password_type = 'text';
    } else {
      this.password_type = 'password';
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
