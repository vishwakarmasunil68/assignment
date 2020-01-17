import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams, ToastController
} from 'ionic-angular';
import {ProfilePage} from "../profile/profile";
import {ReportProblemPage} from "../report-problem/report-problem";
import {PrivacyPolicyPage} from "../privacy-policy/privacy-policy";
import {NewAssignmentPage} from "../new-assignment/new-assignment";
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";
import {ChangePasswordPage} from "../change-password/change-password";

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  toggle_variable: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public menuCtrl: MenuController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    let profileString = window.localStorage.getItem(Constants.USER_LOGIN_DATA);
    try {
      var parsedJSON = JSON.parse(profileString);
      if (parsedJSON.return_data.notification_on_off == "1") {
        this.toggle_variable = true;
      } else {
        this.toggle_variable = false;
      }
    } catch (e) {
      console.log(e);
      this.toggle_variable = false;
    }
    console.log('ionViewDidLoad SettingPage');
  }

  openProfilePage() {
    this.navCtrl.push(ProfilePage);
  }

  openChangePassword() {
    // let alert = this.alertCtrl.create({
    //   title: 'Change Password',
    //   inputs: [
    //     // {
    //     //   name: 'old_password',
    //     //   placeholder: 'Old password',
    //     //   type: 'password'
    //     // },
    //     {
    //       name: 'new_password',
    //       placeholder: 'New Password',
    //       type: 'password'
    //     },
    //     {
    //       name: 'confirm_password',
    //       placeholder: 'Confirm Password',
    //       type: 'password'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Change',
    //       handler: data => {
    //         console.log("change password:-" + JSON.stringify(data));
    //         if (data.new_password == data.confirm_password) {
    //           this.callChangePasswordAPI(data.new_password, data.confirm_password);
    //         } else {
    //           this.presentToast("Password do not match");
    //         }
    //         // this.callChangePasswordAPI(data.);
    //
    //       }
    //     }
    //   ],
    //   enableBackdropDismiss: false
    // });
    // alert.present();

    this.navCtrl.push(ChangePasswordPage);
  }

  callChangePasswordAPI(password: string, confirm_password: string): void {
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
    postdata.append('password', password);
    postdata.append('password_confirm', confirm_password);
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
        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  reportProblem() {
    this.navCtrl.push(ReportProblemPage);
  }

  openPrivayPolicy() {
    this.navCtrl.push(PrivacyPolicyPage);
  }

  openMenu() {
    this.menuCtrl.open();
  }

  newAssignment(): void {
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

  updateToggleSet(): void {
    console.log("toggle variable:-" + this.toggle_variable);
    let toggle_value = "0";
    if (this.toggle_variable) {
      toggle_value = "1";
    } else {
      toggle_value = "0";
    }

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.NOTIFICATION_TOGGLE_URL;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    postdata.append('notification_on_off', toggle_value);
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
          window.localStorage.setItem(Constants.USER_LOGIN_DATA, JSON.stringify(result));
        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })

  }


}
