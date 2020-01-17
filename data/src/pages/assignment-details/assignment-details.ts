import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController, Events,
  IonicPage, LoadingController,
  MenuController, ModalController,
  NavController,
  NavParams, ToastController
} from 'ionic-angular';
import {NewAssignmentPage} from "../new-assignment/new-assignment";
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";
import {TicketClosePage} from "../ticket-close/ticket-close";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";
import {RationModalPage} from "../ration-modal/ration-modal";
import {InAppBrowser} from "@ionic-native/in-app-browser";

/**
 * Generated class for the AssignmentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var RazorpayCheckout: any;

@IonicPage()
@Component({
  selector: 'page-assignment-details',
  templateUrl: 'assignment-details.html',
})
export class AssignmentDetailsPage {

  view_details = true;

  selected_order_id: string = "";

  subject: string = "Assignment Details";
  words_count: string = "";
  partial_amount: string = "";
  cceamount: string = "";
  deadline: string = "";
  ip_order_comment: string = "";
  rating_count: number = 0;

  @ViewChild('listcontent') content: any;

  assignmentCommentList: AssignmentComments[] = [];
  assignmentData: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public menuCtrl: MenuController, public modalCtrl: ModalController
    , public events: Events, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient, private fileTransfer: FileTransfer,
              private fileChooser: FileChooser, private filePath: FilePath, private iab: InAppBrowser) {
  }

  ionViewDidLoad() {

    this.selected_order_id = window.localStorage.getItem("selected_order_id");

    this.getSingleOrderDetails();
    // this.presentProfileModal();

    console.log('ionViewDidLoad AssignmentDetailsPage');

  }


  getSingleOrderDetails(): void {
    this.assignmentData = null;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.SINGLE_ORDER_DETAILS;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    postdata.append('order_id', this.selected_order_id);
    postdata.append('login_type', '1');


    console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
    console.log("order_id:-" + JSON.stringify(postdata.getAll("order_id")));
    console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      try {
        console.log("data:-" + JSON.stringify(result));
        this.assignmentCommentList = [];
        var parsedData = JSON.parse(JSON.stringify(result));
        this.assignmentData = parsedData;
        if (parsedData.status == "success") {
          this.subject = parsedData.return_data.order_detail.subject;
          this.words_count = parsedData.return_data.order_detail.wordcount;
          this.partial_amount = parsedData.return_data.order_detail.partial_amount;
          this.cceamount = parsedData.return_data.order_detail.cceamount;
          this.deadline = parsedData.return_data.order_detail.client_deadline;
          this.rating_count = Number(parsedData.return_data.order_detail.rating);

          for (let i = 0; i < parsedData.return_data.order_comment.length; i++) {

            let is_user = false;
            if (parsedData.return_data.order_comment[i].uid == window.localStorage.getItem(Constants.USER_ID)) {
              is_user = true;
            } else {
              is_user = false;
            }

            let is_attachment = false;
            if (parsedData.return_data.order_comment[i].attachment_url != null || parsedData.return_data.order_comment[i].attachment_url == "") {
              is_attachment = true;
            }

            const assignmentComments: AssignmentComments = {
              noteID: parsedData.return_data.order_comment[i].noteID,
              notes: this.strip(parsedData.return_data.order_comment[i].notes),
              date: parsedData.return_data.order_comment[i].date,
              username: parsedData.return_data.order_comment[i].username,
              uid: parsedData.return_data.order_comment[i].uid,
              attachment_url: parsedData.return_data.order_comment[i].attachment_url,
              is_attachment: is_attachment,
              actual_file_name: parsedData.return_data.order_comment[i].actual_file_name,
              is_user: is_user,
              is_other_user: !is_user
            }

            this.assignmentCommentList.push(assignmentComments);
          }

          console.log("invoice_status:-" + parsedData.return_data.order_detail.invoice_status);
          console.log("inv_status:-" + parsedData.return_data.order_detail.inv_status);

          // this.content.scrollToBottom(300);

        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  checkUrl(index: number): void {
    if (this.assignmentCommentList[index].notes != null) {
      this.linkify(this.assignmentCommentList[index].notes);
    }
  }

  openInChrome(link: string): void {
    console.log("link:-" + link);
    // if (this.assignmentCommentList[index].notes != null) {
    //   this.linkify(link);

    const browser = this.iab.create(link);
    browser.show()
    // }
  }

  linkify(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
      console.log("url found:-" + url);
      // return '<a href="' + url + '">' + url + '</a>';
    });
  }

  presentSheet(): void {

    if (this.assignmentData != null) {

      if ((this.assignmentData.return_data.order_detail.invoice_status == "1" || this.assignmentData.return_data.order_detail.invoice_status == "3")) {
        // if (this.assignmentData.return_data.order_detail.inv_status == "1") {
        this.presentPaymentActionSheet();
        // } else {
        //   this.presentNormalActionSheet();
        // }
      } else {
        this.presentNormalActionSheet();
      }

    } else {
      this.presentToast("Something went wrong");
    }
  }

  actionSheet: any;

  presentNormalActionSheet(): void {
    let view_details_text = "View Details";
    let view_satisfy_details = "Not Satisfied";

    if (this.assignmentData.return_data.order_detail.feedback_status == "1") {
      view_satisfy_details = "View Ticket";
    } else {
      view_satisfy_details = "Not Satisfied";
    }

    if (this.view_details) {
      view_details_text = "Hide Details";
    } else {
      view_details_text = "View Details";
    }

    this.actionSheet = this.actionSheetCtrl.create({
      title: 'Order Options',
      buttons: [

        {
          text: view_details_text,
          handler: () => {
            this.view_details = !this.view_details;

          }
        },
        // {
        //   text: 'Rate',
        //   handler: () => {
        //     this.openRating();
        //   }
        // },
        {
          text: view_satisfy_details,
          handler: () => {
            if (this.assignmentData.return_data.order_detail.feedback_status == "1") {
              this.showTicketCloseModal();
            } else {
              this.showNotSatisfiedAlert();
            }
          }
        }
        // , {
        //   text: 'Verify Details',
        //   handler: () => {
        //     console.log('Archive clicked');
        //   }
        // }
        , {
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    this.actionSheet.present();
  }

  presentPaymentActionSheet(): void {
    let view_details_text = "View Details";
    let view_satisfy_details = "Not Satisfied";

    if (this.assignmentData.return_data.order_detail.feedback_status == "1") {
      view_satisfy_details = "View Ticket";
    } else {
      view_satisfy_details = "Not Satisfied";
    }

    if (this.view_details) {
      view_details_text = "Hide Details";
    } else {
      view_details_text = "View Details";
    }

    let payableAmount = this.assignmentData.return_data.order_detail.invoice_amount;

    const order_detail = this.assignmentData.return_data.order_detail;

    this.actionSheet = this.actionSheetCtrl.create({
      title: 'Please Select',
      buttons: [
        // {
        //   text: 'Rate',
        //   handler: () => {
        //     // this.openRating();
        //   }
        // },
        {
          text: view_details_text,
          handler: () => {
            this.view_details = !this.view_details;

          }
        }, {
          text: view_satisfy_details,
          handler: () => {
            if (this.assignmentData.return_data.order_detail.feedback_status == "1") {
              this.showTicketCloseModal();
            } else {
              this.showNotSatisfiedAlert();
            }
          }
        }
        , {
          text: 'Pay ' + order_detail.currency + ' ' + payableAmount,
          handler: () => {
            console.log('Archive clicked');
            // const order_detail = this.assignmentData.return_data.order_detail;
            console.log("order detail:-" + JSON.stringify(order_detail));
            this.paymentGateway(order_detail.username, order_detail.email, order_detail.client_phone, order_detail.currency, order_detail.invoice_amount);
          }
        }
        , {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    this.actionSheet.present();
  }

  paymentGateway(name: string, email: string, contact: string, currency: string, amount: string): void {

    const description = "Payment of amount " + currency + " " + amount;

    let pay_amount = Number(amount);

    // if (currency == "USD") {
    //   pay_amount = pay_amount * 68.56;
    // }

    pay_amount = pay_amount * 100;

    var options = {
      description: description,
      image: 'https://www.myassignmentservices.com/uat/p/images/logo-white.svg',
      currency: currency,
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
      }
    };

    var successCallback = function (payment_id) {
      alert('payment_id: ' + payment_id);
    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  showTicketCloseModal() {

    let user_id = this.assignmentData.return_data.order_detail.user_id;
    let order_id = this.assignmentData.return_data.order_detail.id;
    let feedback_id = this.assignmentData.return_data.order_detail.feedback_id;
    let ticket_no = this.assignmentData.return_data.order_detail.ticket_no;
    let feedback_date = this.assignmentData.return_data.order_detail.feedback_date;
    let description = this.assignmentData.return_data.order_detail.description;

    let ticketCloseModal = this.modalCtrl.create(TicketClosePage, {
      user_id: user_id,
      order_id: order_id,
      feedback_id: feedback_id,
      feedback_date: feedback_date,
      description: description,
      ticket_no: ticket_no
    }, {
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    ticketCloseModal.present();
  }

  openRating() {
    const alert = this.alertCtrl.create({
      title: 'Rate',
      cssClass: 'alertstar',
      enableBackdropDismiss: true,
      buttons: [
        {
          text: '1', handler: data => {
            this.resolveRec(1);
          }
        },
        {
          text: '2', handler: data => {
            this.resolveRec(2);
          }
        },
        {
          text: '3', handler: data => {
            this.resolveRec(3);
          }
        },
        {
          text: '4', handler: data => {
            this.resolveRec(4);
          }
        },
        {
          text: '5', handler: data => {
            this.resolveRec(5);
          }
        }
      ]
    });
    alert.present();
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  resolveRec(number) {

  }

  newAssignment(): void {
    this.navCtrl.push(NewAssignmentPage);
  }

  openMenu(): void {
    this.menuCtrl.open();
  }

  sendComment(): void {
    // if (this.attached_file_path == "") {
    if (this.ip_order_comment == "") {
      this.presentToast("Please Enter Comment");
    } else {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

      var url = Constants.SEND_ORDER_COMMENT;

      console.log("url:-" + url);
      let postdata = new FormData();

      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
      postdata.append('order_id', this.selected_order_id);
      postdata.append('comments', this.ip_order_comment);
      postdata.append('can_user_view', '1');
      postdata.append('cce', '1');
      postdata.append('operations', '1');
      postdata.append('attachments', '');
      postdata.append('login_type', '1');


      console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
      console.log("order_id:-" + JSON.stringify(postdata.getAll("order_id")));
      console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));
          if (parsedData.status == "success") {

            this.attached_file_path = "";

            let is_user = false;
            if (parsedData.return_data[0].uid == window.localStorage.getItem(Constants.USER_ID)) {
              is_user = true;
            } else {
              is_user = false;
            }

            let is_attachment = false;
            if (parsedData.return_data[0].attachment_url != null || parsedData.return_data[0].attachment_url != "") {
              is_attachment = true;
            }

            const assignmentComments: AssignmentComments = {
              noteID: parsedData.return_data[0].noteID,
              notes: parsedData.return_data[0].notes,
              date: parsedData.return_data[0].date,
              username: parsedData.return_data[0].username,
              uid: parsedData.return_data[0].uid,
              attachment_url: parsedData.return_data[0].attachment_url,
              is_attachment: is_attachment,
              actual_file_name: parsedData.return_data[0].actual_file_name,
              is_user: is_user,
              is_other_user: !is_user
            }

            this.assignmentCommentList.push(assignmentComments);

            this.ip_order_comment = "";

          } else {
            this.presentToast(parsedData.message);
          }
        } catch (err) {
          console.log(err);
        }
      })
    }
    // } else {
    //   this.addMultipartAssignment();
    // }
  }

  showNotSatisfiedAlert(): void {
    const prompt = this.alertCtrl.create({
      title: 'Tell us why you are dissatisfied',
      message: "We are extremely sorry that you are not satisfied with our services. Customer satisfaction is our top priority and we take your feedback seriously. Please describe your issue in the box below.",
      inputs: [
        {
          name: 'title',
          placeholder: ''
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log("data:-" + JSON.stringify(data));
            try {
              if (data.title == "") {
                this.presentToast("Please Enter description");
              } else {
                this.callNotSatisfyAPI(data.title);
                // this.presentToast("Description:-"+data.title);
              }
            } catch (err) {
              console.log(err);
            }
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  callNotSatisfyAPI(description: string) {
    console.log("description:-" + description);
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.NOT_SATISFY_API;

    console.log("url:-" + url);
    let postdata = new FormData();

    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    postdata.append('order_id', this.selected_order_id);
    postdata.append('description', description);
    postdata.append('login_type', '1');


    console.log("user_id:-" + JSON.stringify(postdata.getAll("user_id")));
    console.log("order_id:-" + JSON.stringify(postdata.getAll("order_id")));
    console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      try {
        console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));
        if (parsedData.status == "success") {

          this.getSingleOrderDetails();
        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  strip(html: string) {
    return html;
    // return html.replace(/<(?:.|\n)*?>/gm, '');
  }

  chooseFile(): void {
    this.fileChooser.open()
      .then(uri => {
        console.log(uri);
        this.filePath.resolveNativePath(uri)
          .then((filePath) => {
            // alert(filePath);
            console.log("file path:-" + filePath);
            var currentName = filePath.substr(filePath.lastIndexOf('/') + 1);
            this.addMultipartAssignment(filePath, currentName);
            // this.attached_file_path = filePath;
          }, (err) => {
            console.log(err);
          })
      })
      .catch(e => console.log(e));
  }

  attached_file_path = "";

  addMultipartAssignment(filePath, currentName): void {
    // if (this.ip_order_comment == '') {
    //   this.presentToast("Please Enter Comment");
    // } else {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    // var file_name = this.attached_file_path.substr(this.attached_file_path.lastIndexOf('/') + 1);
    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.SEND_ORDER_COMMENT;

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    let options: FileUploadOptions = {
      fileKey: 'attachments[0]',
      fileName: currentName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {
        'device_token': 'token',
        'device_name': 'note5pro',
        'device_os': 'android',
        'language': 'en',
        'location_lant': '234.3343434',
        'location_long': '-234.3343434',
        'user_id': window.localStorage.getItem(Constants.USER_ID),
        'order_id': this.selected_order_id,
        'comments': this.ip_order_comment,
        'login_type': '1'
      }
    }

    fileTransfer.upload(filePath, url, options)
      .then((data) => {

        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(data));
          var fileData = JSON.parse(JSON.stringify(data));
          var parsedData = JSON.parse(fileData.response);
          if (parsedData.status == "success") {

            this.attached_file_path = "";

            let is_user = false;
            if (parsedData.return_data[0].uid == window.localStorage.getItem(Constants.USER_ID)) {
              is_user = true;
            } else {
              is_user = false;
            }

            let is_attachment = false;
            if (parsedData.return_data[0].attachment_url != null || parsedData.return_data[0].attachment_url != "") {
              is_attachment = true;
            }

            const assignmentComments: AssignmentComments = {
              noteID: parsedData.return_data[0].noteID,
              notes: parsedData.return_data[0].notes,
              date: parsedData.return_data[0].date,
              username: parsedData.return_data[0].username,
              uid: parsedData.return_data[0].uid,
              attachment_url: parsedData.return_data[0].attachment_url,
              is_attachment: is_attachment,
              actual_file_name: parsedData.return_data[0].actual_file_name,
              is_user: is_user,
              is_other_user: !is_user
            }

            this.assignmentCommentList.push(assignmentComments);

            this.ip_order_comment = "";

          } else {
            this.presentToast(parsedData.message);
          }
        } catch (err) {
          console.log(err);
        }
        // this.presentToast("Image uploaded successfully");
      }, (err) => {
        console.log(err);
        loading.dismiss();
        this.presentToast(err);
      });
    // }

  }

  logRatingChange(rating) {
    console.log("changed rating: ", rating);

    //
    let ticketCloseModal = this.modalCtrl.create(RationModalPage, {
      order_id: this.assignmentData.return_data.order_detail.id,
      rating: rating
    }, {
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    ticketCloseModal.present();
    // do your stuff
  }

  ionViewWillLeave() {
    if(this.actionSheet!=null){
      this.actionSheet.dismiss();
    }
  }

}


interface AssignmentComments {
  noteID: string;
  notes: string;
  date: string;
  username: string;
  uid: string;
  attachment_url: string;
  is_attachment: boolean;
  actual_file_name: string;
  is_user: boolean;
  is_other_user: boolean;
}


