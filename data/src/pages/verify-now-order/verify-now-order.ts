import {Component} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as Constants from "../../models/Constants";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";

/**
 * Generated class for the VerifyNowOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verify-now-order',
  templateUrl: 'verify-now-order.html',
})
export class VerifyNowOrderPage {

  order_id: string = "";
  index: number;
  type: number;

  order_code: string = "";
  word_count: string = "";
  subject: string = "";
  description: string = "";
  old_notes: string = "";
  attachments: Attachment[] = [];
  attach_found = false;
  is_accepted = false;
  is_file_selected = false;
  selected_file_name = "";
  selected_file_path = "";
  notes_id = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public http: HttpClient, private fileTransfer: FileTransfer,
              private fileChooser: FileChooser, private filePath: FilePath) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyNowOrderPage');
    this.order_id = window.localStorage.getItem("verify_order_id");
    this.index = Number(window.localStorage.getItem("index"));
    this.type = Number(window.localStorage.getItem("type"));
    // this.order_id = "9930";
    this.preOrderDetails();
  }

  attach(): void {
    this.fileChooser.open()
      .then(uri => {
        console.log(uri);
        this.filePath.resolveNativePath(uri)
          .then((filePath) => {
            // alert(filePath);
            console.log("file path:-" + filePath);
            this.selected_file_path = filePath;
            this.is_file_selected = true;
            var currentName = this.selected_file_path.substr(this.selected_file_path.lastIndexOf('/') + 1);
            this.selected_file_name = currentName;
            // this.show_attached_file=true;
          }, (err) => {
            console.log(err);
          })
      })
      .catch(e => console.log(e));
  }

  submit(): void {
    if(this.description==''){
      this.presentToast("Please Enter Description");
      return;
    }
    if(!this.is_accepted){
      this.presentToast("Please Accept Terms and Conditions");
      return;
    }
    if (this.is_file_selected) {
      this.addMultipartAssignment();
    } else {
      this.confirmWithoutAttachment();
    }
  }

  addMultipartAssignment(): void {

    var currentName = this.selected_file_path.substr(this.selected_file_path.lastIndexOf('/') + 1);


    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.CONFIRM_ORDER;

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    var jsonData = JSON.parse(window.localStorage.getItem(Constants.USER_LOGIN_DATA));

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
        'order_id': this.order_id,
        'login_type': '1',
        'notes': this.description,
        'notes_id': this.notes_id,
        'old_notes': this.old_notes,
        'user_id':  window.localStorage.getItem(Constants.USER_ID),
        'name': jsonData.return_data.username,
        'email': jsonData.return_data.email
      }
    }

    fileTransfer.upload(this.selected_file_path, url, options)
      .then((data) => {

        loading.dismiss();

        console.log("result:-" + JSON.stringify(data));
        if (data.responseCode == 200) {
          // var parsedJSON=JSON.parse(JSON.stringify(data.response));
          var parsedJSON = JSON.parse(data.response);
          console.log("parsed json:-" + JSON.stringify(parsedJSON));
          if (parsedJSON.status == "success") {
            this.presentToast(parsedJSON.message);
            this.events.publish('order_confirmation',this.index+","+this.type);
          } else {
            this.presentToast(parsedJSON.message);
          }
        } else {
          this.presentToast("Something went wrong")
        }
        // this.presentToast("Image uploaded successfully");
      }, (err) => {
        console.log(err);
        loading.dismiss();
        this.presentToast(err);
      });
  }

  confirmWithoutAttachment(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.CONFIRM_ORDER;

    var jsonData = JSON.parse(window.localStorage.getItem(Constants.USER_LOGIN_DATA));

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('order_id', this.order_id);
    postdata.append('notes', this.description);
    postdata.append('notes_id', this.notes_id);
    postdata.append('old_notes', this.old_notes);
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    postdata.append('name', jsonData.return_data.username);
    postdata.append('email', jsonData.return_data.email);
    postdata.append('login_type', '1');

    console.log("order_id:-" + JSON.stringify(postdata.getAll("order_id")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      this.attachments = [];
      try {
        console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));
        if (parsedData.status == "success") {
          this.events.publish('order_confirmation',this.index+","+this.type);
        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  preOrderDetails(): void {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.ORDER_DETAIL_FOR_CONFIRMATION;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('order_id', this.order_id);
    postdata.append('login_type', '1');

    console.log("order_id:-" + JSON.stringify(postdata.getAll("order_id")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      this.attachments = [];
      try {
        console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));
        if (parsedData.status == "success") {
          // let notes=parsedData.return_data.notes;
          // let notes_id=parsedData.return_data.notes_id;
          // let notes=parsedData.return_data.notes;
          // let notes=parsedData.return_data.notes;
          this.order_code = parsedData.return_data.order_code;
          this.word_count = parsedData.return_data.worth_word;
          this.subject = parsedData.return_data.subject;

          if (parsedData.return_data.att != null && parsedData.return_data.att.length != 0) {
            this.attach_found = true;
          } else {
            this.attach_found = false;
          }

          for (let i = 0; i < parsedData.return_data.att.length; i++) {
            const att: Attachment = {
              file_name: parsedData.return_data.att[i].file_name,
              actual_file_name: parsedData.return_data.att[i].actual_file_name,
              date: parsedData.return_data.att[i].date
            }
            this.attachments.push(att);
          }
          this.description = this.strip(parsedData.return_data.notes);
          this.old_notes = parsedData.return_data.notes;
          this.notes_id = parsedData.return_data.notes_id;

        } else {

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

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}

interface Attachment {
  file_name: string;
  actual_file_name: string;
  date: string;
}
