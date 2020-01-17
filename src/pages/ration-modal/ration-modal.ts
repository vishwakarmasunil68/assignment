import {Component, Renderer} from '@angular/core';
import {
  Events,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the RationModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ration-modal',
  templateUrl: 'ration-modal.html',
})
export class RationModalPage {

  message: string = "";
  rating_count: number;
  order_id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public renderer: Renderer, public viewCtrl: ViewController, public events: Events, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private http: HttpClient) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'rating-custom-popup', true);
  }


  ionViewDidLoad() {
    this.rating_count = this.navParams.get('rating');
    this.order_id = this.navParams.get('order_id');
    console.log('ionViewDidLoad RatingModalPage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  submit() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.SEND_ORDER_REVIEW;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    postdata.append('order_id', this.order_id);
    postdata.append('review_text', this.message);
    postdata.append('rating', this.rating_count+"");
    postdata.append('login_type', '1');


    console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
    console.log("order_id:-" + JSON.stringify(postdata.getAll("order_id")));
    console.log("feedback_id:-" + JSON.stringify(postdata.getAll("feedback_id")));
    console.log("ticket_no:-" + JSON.stringify(postdata.getAll("ticket_no")));
    console.log("ticket_close:-" + JSON.stringify(postdata.getAll("ticket_close")));
    console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      try {
        console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));
        if (parsedData.status == "success") {
          this.presentToast("Review Sent");
          this.viewCtrl.dismiss();
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
