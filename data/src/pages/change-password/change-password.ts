import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  profile_pic: string = "assets/imgs/default_pic.png";
  new_password: string = "";
  confirm_password: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');

    var jsonData = JSON.parse(window.localStorage.getItem(Constants.USER_LOGIN_DATA));
    console.log("user profile:-" + JSON.stringify(jsonData));
    if (jsonData.return_data.image == "") {
      this.profile_pic = "assets/imgs/default_pic.png";
    } else {
      this.profile_pic = jsonData.return_data.image;
    }
  }

  callChangePasswordAPI(): void {

    if(this.new_password==this.confirm_password){
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

      var url = Constants.CHANGE_PASSWORD;

      console.log("url:-" + url);
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
      postdata.append('password', this.new_password);
      postdata.append('password_confirm', this.confirm_password);
      postdata.append('login_type', '1');


      console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
      // console.log("order_type:-" + JSON.stringify(postdata.getAll("order_type")));
      // console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));
          if (parsedData.status == "success") {
            this.presentToast(parsedData.message);
            this.navCtrl.pop();
          } else {
            this.presentToast(parsedData.message);
          }
        } catch (err) {
          console.log(err);
        }
      })
    }else{
      this.presentToast("Password and confirm password mismatched. Try Again");
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
