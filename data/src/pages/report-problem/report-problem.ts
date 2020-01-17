import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as Constants from "../../models/Constants";

/**
 * Generated class for the ReportProblemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-problem',
  templateUrl: 'report-problem.html',
})
export class ReportProblemPage {

  message: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportProblemPage');
  }

  backView(): void {
    this.viewCtrl.dismiss();
  }

  reportProblemAPI(): void {
    if (this.message == "") {
      this.presentToast("Please enter message");
    } else {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

      var url = Constants.FEEDBACK_URL;

      console.log("url:-" + url);
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
      postdata.append('feedback', this.message);
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
