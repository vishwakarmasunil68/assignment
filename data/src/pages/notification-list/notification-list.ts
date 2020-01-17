import {Component} from '@angular/core';
import {
  Events,
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams, ToastController
} from 'ionic-angular';
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the NotificationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html',
})
export class NotificationListPage {

  notificationPOJOS: NotificationPOJO[] = [];

  notifications: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public events: Events, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationListPage');
    // this.notifications.push("");
    // this.notifications.push("");
    // this.notifications.push("");
    // this.notifications.push("");
    // this.notifications.push("");
    // this.notifications.push("");
    // this.notifications.push("");
    // this.notifications.push("");
    // this.notifications.push("");
    // this.notifications.push("");
    this.getOrderList();
  }


  getItems(data) {
    console.log("search data:-" + data);
  }

  openMenu() {
    this.menuCtrl.open();
  }

  getOrderList() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.GET_NOTIFICATIONS;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('user_id', '1196');
    postdata.append('notification_device', 'android');

    // console.log("post data length:-"+JSON.stringify(postdata.getAll('')));

    console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
    console.log("order_type:-" + JSON.stringify(postdata.getAll("order_type")));
    console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      this.notificationPOJOS = [];
      try {
        console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));

        if (parsedData.status == "success") {
          for (let i = 0; i < parsedData.return_data.length; i++) {
            const notificationPOJO: NotificationPOJO = {
              id: parsedData.return_data[i].id,
              user_id: parsedData.return_data[i].user_id,
              order_id: parsedData.return_data[i].order_id,
              website_id: parsedData.return_data[i].website_id,
              notification_type: parsedData.return_data[i].notification_type,
              notification_title: parsedData.return_data[i].notification_title,
              notification_description: parsedData.return_data[i].notification_description,
              notification_link: parsedData.return_data[i].notification_link,
              notification_on_display: parsedData.return_data[i].notification_on_display,
              notification_read_unread: parsedData.return_data[i].notification_read_unread,
              notification_read_on: parsedData.return_data[i].notification_read_on,
              notification_status: parsedData.return_data[i].notification_status,
              notification_device: parsedData.return_data[i].notification_device
            }

            this.notificationPOJOS.push(notificationPOJO);
          }

        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })

  }

  openOrderDetail(index){
    // window.localStorage.setItem('selected_order_id',this.notificationPOJOS[index].order_id);
    // this.navCtrl.push(AssignmentDetailsPage);
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

interface NotificationPOJO {
  id: string;
  user_id: string;
  order_id: string;
  website_id: string;
  notification_type: string;
  notification_title: string;
  notification_description: string;
  notification_link: string;
  notification_on_display: string;
  notification_read_unread: string;
  notification_read_on: string;
  notification_status: string;
  notification_device: string;
}
