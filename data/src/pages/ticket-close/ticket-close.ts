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
 * Generated class for the TicketClosePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ticket-close',
  templateUrl: 'ticket-close.html',
})
export class TicketClosePage {

  check_yes: boolean = true;
  check_no: boolean = false;

  user_id: string = "";
  order_id: string = "";
  feedback_id: string = "";
  ticket_no: string = "";
  description: string = "";
  feedback_date: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public renderer: Renderer, public viewCtrl: ViewController, public events: Events, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'custom-popup', true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketClosePage');
    this.user_id=this.navParams.get('user_id');
    this.order_id=this.navParams.get('order_id');
    this.feedback_id=this.navParams.get('feedback_id');
    this.ticket_no=this.navParams.get('ticket_no');
    this.feedback_date=this.navParams.get('feedback_date');
    this.description=this.navParams.get('description');
  }


  setYes() {
    console.log("changing yes");
    this.check_yes = true;
    this.check_no = false;
  }

  setNo() {
    console.log("changing no");
    this.check_yes = false;
    this.check_no = true;
  }


  yesClicked(): void {
    // console.log("");
    if (this.check_yes) {
      this.check_no = false;
    }
  }

  noClicked(): void {
    if (this.check_no) {
      this.check_yes = false;
    }
  }

  submit(): void {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.CLOSE_NOT_SATISFIED_TICKETS;

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
    postdata.append('feedback_id', this.feedback_id);
    postdata.append('ticket_no', this.ticket_no);
    postdata.append('ticket_close', '1');
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
          this.presentToast("ticket Closed");
          this.viewCtrl.dismiss();
        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  cancel(): void {
    this.viewCtrl.dismiss();
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
