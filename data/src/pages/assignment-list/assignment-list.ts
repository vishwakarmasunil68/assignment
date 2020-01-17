import {Component} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the AssignmentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var RazorpayCheckout: any;


@IonicPage()
@Component({
  selector: 'page-assignment-list',
  templateUrl: 'assignment-list.html',
})

export class AssignmentListPage {

  assignment_found: boolean = true;

  mainOrderList: Orders[] = [];
  orderList: Orders[] = [];
  showCards: boolean[] = [];
  verified_order = "verified_order";
  non_verified_order = "not_verified_order";

  //"1= enquriy, 2= expired, 3= in process, 4= delivered"
  tab_index: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient) {
    console.log("index:-" + navParams.get('tab_index'));
    this.tab_index = navParams.get('tab_index');
    this.events.subscribe('order_confirmation', (data) => {
      if (data.split(",")[1] == this.tab_index) {
        this.orderList[Number(data.split(",")[0])].is_order_verified = true;
      }
    });
  }

  doRefresh(refresher){

      this.getOrderList();

      if(refresher != 0){
        refresher.complete();
      }

  };

  newAssignment(): void {
    this.events.publish('place_order', 'place_order');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssignmentListPage');
    this.getOrderList();

    // console.log("tab index:-"+this.tab_index);
    // if(this.tab_index=="0"){
    //   this.navCtrl.parent.select(1);
    // }
    // this.events.subscribe('tab_selection', (data) => {
    //   console.log("tab_selection list:-" + data);
    //   setTimeout( () => {
    //     if(this.tab_index=="3"){
    //       this.selectTab(data);
    //     }
    //   }, 2000);
    //
    // });

  }

  search_input: string = "";

  onSearchInput(key) {
    // console.log("key:-" + JSON.stringify(this.search_input));
    if (this.search_input == '') {
      this.orderList = this.mainOrderList;
    } else {
      this.orderList = [];
      for (let i = 0; i < this.mainOrderList.length; i++) {
        if (this.mainOrderList[i].subject != null) {
          if (
            this.mainOrderList[i].name.toLowerCase().includes(this.search_input.toLowerCase())
            || this.mainOrderList[i].subject.toLowerCase().includes(this.search_input.toLowerCase())
            || this.mainOrderList[i].order_code.toLowerCase().includes(this.search_input.toLowerCase())
          ) {
            this.orderList.push(this.mainOrderList[i]);
          }
        } else {
          if (
            this.mainOrderList[i].name.toLowerCase().includes(this.search_input.toLowerCase())
          ) {
            this.orderList.push(this.mainOrderList[i]);
          }
        }

      }
    }
  }

  selectTab(data) {
    switch (data) {
      case "enquiries":
        this.navCtrl.parent.select(1);
        break;
      case "in_process":
        this.navCtrl.parent.select(0);
        break;
      case "delivered":
        this.navCtrl.parent.select(1);
        break;
      case "expired":
        this.navCtrl.parent.select(4);
        break;
    }
  }

  openMenu(): void {
    this.events.publish("tab_clicked", "open_menu");
  }

  showCard(position): void {
    for (let i = 0; i < this.showCards.length; i++) {
      this.showCards[i] = false;
    }
    if (this.showCards[position]) {
      this.showCards[position] = false;
    } else {
      this.showCards[position] = true;
    }
  }

  viewAssignment(id: string): void {
    // console.log("tab index:-"+this.tab_index);
    // this.navCtrl.parent.select(1);
    // console.log("type of :-"+(typeof this.navCtrl.parent));
    window.localStorage.setItem("selected_order_id", id);
    this.events.publish('tab_clicked', 'view_assignment');
  }

  getItems(data) {
    console.log("search data:-" + data);
  }

  openNotifications() {
    this.events.publish('tab_clicked', 'notifications');
  }

  getOrderList() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.GET_USERS_ORDERS;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    postdata.append('order_type', this.tab_index);
    postdata.append('login_type', '1');

    // console.log("post data length:-"+JSON.stringify(postdata.getAll('')));

    console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
    console.log("order_type:-" + JSON.stringify(postdata.getAll("order_type")));
    console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      this.mainOrderList = [];
      this.orderList = [];
      try {
        // console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));

        if (parsedData.status == "success") {
          this.assignment_found = true;
          // this.presentToast(parsedData.message);
          for (let i = 0; i < parsedData.return_data.length; i++) {

            let lead_status = "";

            switch (parsedData.return_data[i].lead_status) {
              case "1":
                lead_status = "Enquiry";
                break;
              case "2":
                lead_status = "Expired";
                break;
              case "3":
                lead_status = "In Process";
                break;
              case "4":
                lead_status = "Delivered";
                break;
            }

            let title = parsedData.return_data[i].subject;

            if (parsedData.return_data[i].order_code != '') {
              title = parsedData.return_data[i].order_code
            }

            let p_status = false;

            if (parsedData.return_data[i].cceamount == parsedData.return_data[i].partial_amount) {
              p_status = false;
            } else {
              p_status = true;
            }

            let order_verification_status = false;

            if (parsedData.return_data[i].confirm_order == "0") {
              order_verification_status = false;
            } else {
              order_verification_status = true;
            }

            let feedback_status = false;
            if (parsedData.return_data[i].feedback_status == "1") {
              feedback_status = true;
            }
            let wordcount = parsedData.return_data[i].wordcount;
            if (parsedData.return_data[i].wordcount == "") {
              wordcount = "NA"
            }


            let show_payment_slide = false;

            if ((parsedData.return_data[i].invoice_status == "1" || parsedData.return_data[i].invoice_status == "3")) {
              show_payment_slide = true;
            }

            const order: Orders = {
              id: parsedData.return_data[i].id,
              order_title: title,
              order_code: parsedData.return_data[i].order_code,
              name: parsedData.return_data[i].name,
              subject: parsedData.return_data[i].subject,
              wordcount: wordcount,
              cceamount: parsedData.return_data[i].cceamount,
              partial_amount: parsedData.return_data[i].partial_amount,
              delivery_date: parsedData.return_data[i].delivery_date,
              lead_status: lead_status,
              client_deadline: parsedData.return_data[i].client_deadline,
              client_deadline_display: parsedData.return_data[i].client_deadline_display,
              p_status: p_status,
              feedback_status: feedback_status,
              currency: parsedData.return_data[i].currency,
              confirm_order: parsedData.return_data[i].confirm_order,
              is_order_verified: order_verification_status,
              show_payment_slide: show_payment_slide,
              username: parsedData.return_data[i].username,
              email: parsedData.return_data[i].email,
              invoice_amount: parsedData.return_data[i].invoice_amount,
              client_phone: parsedData.return_data[i].client_phone,
              invoice_no: parsedData.return_data[i].invoice_no
            }

            this.mainOrderList.push(order);
            this.orderList.push(order);
          }

        } else {
          this.assignment_found = false;
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  payAmount(index: number) {

    console.log("order id:-" + this.orderList[index].id);
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.INVOICE_DETAIL;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('order_id', this.orderList[index].id);
    postdata.append('invoice_no', this.orderList[index].invoice_no);
    postdata.append('login_type', '1');

    // console.log("post data length:-"+JSON.stringify(postdata.getAll('')));

    console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
    console.log("order_type:-" + JSON.stringify(postdata.getAll("order_type")));
    console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      try {
        console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));

        this.presentToast(parsedData.message);

        if (parsedData.status == "success") {
          this.paymentGateway(index, this.orderList[index].name, this.orderList[index].email, this.orderList[index].client_phone,
            parsedData.return_data.currency_name, parsedData.return_data.actual_amount, parsedData.return_data.total_amount, this.orderList[index].id, this.orderList[index].invoice_no);
        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  paymentGateway(index: number, name: string, email: string, contact: string, currency: string, amount: string, display_amount: string, order_id: string, invoice_number: string): void {

    console.log("name:-" + name);
    console.log("email:-" + email);
    console.log("contact:-" + contact);
    console.log("currency:-" + currency);
    console.log("amount:-" + amount);

    const description = "Payment of amount " + currency + " " + amount;

    let pay_amount = Number(amount);

    // pay_amount = pay_amount * 100;

    var options = {
      description: description,
      image: 'https://www.myassignmentservices.com/uat/p/images/logo-white.svg',
      currency: 'INR',
      key: 'rzp_test_z9Oh4CFDuGZKIz',
      amount: pay_amount,
      name: name,
      prefill: {
        email: email,
        contact: contact,
        name: name
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      },
      display_currency: currency,
      display_amount: display_amount
    };

    // var successCallback = function (payment_id) {
    //   alert('payment_id: ' + payment_id);
    //
    //
    // };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, (payment_id) => {

      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

      var url = Constants.PAYMENT_DONE;

      console.log("url:-" + url);
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
      postdata.append('order_id', order_id);
      postdata.append('invoice_no', invoice_number);
      postdata.append('payment_id', payment_id);
      postdata.append('order_status', 'Success');
      postdata.append('gateway', 'RAZORPAY');
      postdata.append('login_type', '1');

      // console.log("post data length:-"+JSON.stringify(postdata.getAll('')));

      // console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
      // console.log("order_type:-" + JSON.stringify(postdata.getAll("order_type")));
      // console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        // this.mainOrderList = [];
        // this.orderList = [];
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));

          if (parsedData.status == "success") {
            this.orderList[index].show_payment_slide = false;
          } else {

          }


          let toast = this.toastCtrl.create({
            message: parsedData.message,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();

        } catch (err) {
          console.log(err);
        }
      })

    }, cancelCallback);
  }

  preVerifyOrder(index: number) {
    // console.log("order id:-" + this.orderList[index].id);
    // let loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    //
    // loading.present();
    //
    // console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));
    //
    // var url = Constants.ORDER_DETAIL_FOR_CONFIRMATION;
    //
    // console.log("url:-" + url);
    // let postdata = new FormData();
    // postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    // postdata.append('device_name', 'Mi Note 7 Pro');
    // postdata.append('device_os', 'android');
    // postdata.append('language', 'en');
    // postdata.append('location_lant', '234.3343434');
    // postdata.append('location_long', '234.3343434');
    // // postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    // postdata.append('order_id', this.orderList[index].id);
    // postdata.append('login_type', '1');
    //
    // // console.log("post data length:-"+JSON.stringify(postdata.getAll('')));
    //
    // // console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
    // console.log("order_id:-" + JSON.stringify(postdata.getAll("order_id")));
    // // console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));
    //
    // this.http.post(url, postdata).subscribe(result => {
    //   loading.dismiss();
    //   try {
    //     console.log("data:-" + JSON.stringify(result));
    //     var parsedData = JSON.parse(JSON.stringify(result));
    //
    //     // this.presentToast(parsedData.message);
    //
    //     // order_id: 9842
    //     // notes : test
    //     //  : 31720
    //     // old_notes : testing
    //     // user_id : 1043
    //     // name : nagendra
    //     // email : dev4.digiversal@gmail.com
    //     // attachments : file
    //     // login_type: 1
    //     //
    //     if (parsedData.status == "success") {
    //       // let notes=parsedData.return_data.notes;
    //       // let notes_id=parsedData.return_data.notes_id;
    //       // let notes=parsedData.return_data.notes;
    //       // let notes=parsedData.return_data.notes;
    //     } else {
    //
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // })

    window.localStorage.setItem("verify_order_id", this.orderList[index].id);
    window.localStorage.setItem("index", index+"");
    window.localStorage.setItem("type", this.tab_index);
    this.events.publish('tab_clicked', 'verify_assignment');

  }

  verifyOrder(index: number) {
    console.log("order id:-" + this.orderList[index].id);
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.CONFIRM_ORDER;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    postdata.append('order_id', this.orderList[index].id);
    postdata.append('login_type', '1');

    // console.log("post data length:-"+JSON.stringify(postdata.getAll('')));

    console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
    console.log("order_type:-" + JSON.stringify(postdata.getAll("order_type")));
    console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      try {
        console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));

        this.presentToast(parsedData.message);

        if (parsedData.status == "success") {
          this.orderList[index].is_order_verified = true;
        } else {

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

interface Orders {
  id: string;
  order_title: string;
  order_code: string;
  name: string;
  subject: string;
  wordcount: string;
  cceamount: string;
  partial_amount: string;
  delivery_date: string;
  lead_status: string;
  client_deadline: string;
  client_deadline_display: string;
  p_status: boolean;
  feedback_status: boolean;
  currency: string;
  confirm_order: string;
  is_order_verified: boolean;
  show_payment_slide: boolean;
  username: string;
  email: string;
  invoice_amount: string;
  client_phone: string;
  invoice_no: string;
}
