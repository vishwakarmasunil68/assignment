import {Component} from '@angular/core';
import {
  Events,
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";
import {SubjectSelectPage} from "../subject-select/subject-select";
import {UniversitySelectPage} from "../university-select/university-select";

/**
 * Generated class for the NewAssignmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-assignment',
  templateUrl: 'new-assignment.html',
})
export class NewAssignmentPage {

  startDate: string = "Date";
  word_count: string = "";
  comment: string = "";

  universityList: University[] = [];
  subjectList: Subject[] = [];

  attached_file_path = "";
  show_attached_file=false;

  selectedSubject:string="Select Subject";
  selectedSubjectPOJO:Subject;

  selectedUniversity:string="Select University";
  selectedUniversityPOJO:University;


  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: HttpClient, private fileTransfer: FileTransfer,
              private fileChooser: FileChooser, private filePath: FilePath,private events:Events) {
    var d = new Date();

    d.setHours(d.getHours()+10);

    let date = this.properFormatNumber(d.getDate());
    let month = this.properFormatNumber(d.getMonth() + 1);
    let year = d.getFullYear();



    let hour=this.properFormatNumber(d.getHours());
    let minutes=this.properFormatNumber(d.getMinutes());
    let sec=this.properFormatNumber(d.getSeconds());


    console.log("hourse:-"+hour+":"+minutes+":"+sec);

    this.startDate = year + "-" + month + "-" + date + "T"+hour+":"+minutes+":"+sec+"Z";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAssignmentPage');
  }

  openSelectCountryPage(): void {
    this.navCtrl.push(SubjectSelectPage, {
      callback: this.subjectCallBackFunction
    });
  }

  close():void{
    this.navCtrl.pop();
  }

  subjectCallBackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      console.log("data got:-" + JSON.stringify(_params));
      const callbackSubject: Subject = {
        id: _params.id,
        parent: _params.parent,
        name: _params.name,
        active: _params.active,
        created_date: _params.created_date,
        created_by: _params.created_by,
        modified_date: _params.modified_date,
        modified_by: _params.modified_by
      }
      this.selectedSubjectPOJO = callbackSubject;
      this.selectedSubject= callbackSubject.name;
      resolve();
    });
  }

  openUniversitySelectPage(): void {
    this.navCtrl.push(UniversitySelectPage, {
      callback: this.universityCallBackFunction
    });
  }

  universityCallBackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      console.log("data got:-" + JSON.stringify(_params));
      const callbackuniversity: University = {
        id: _params.id,
        name: _params.name,
        active: _params.active,
        date: _params.date,
        created_by: _params.created_by,
        modified_date: _params.modified_date,
        modified_by: _params.modified_by
      }
      this.selectedUniversity = callbackuniversity.name;
      this.selectedUniversityPOJO= callbackuniversity;
      resolve();
    });
  }

  properFormatNumber(number: number): string {
    let numString = "";
    if (number < 10) {
      numString = "0" + number;
    } else {
      numString = number + "";
    }
    return numString;
  }

  openMenu(): void {
    this.menuCtrl.open();
  }

  replaceStringContent(str: string, replaceWith: string, replaceTo: string): string {
    str = str.replace(replaceWith, replaceTo);
    return str;
  }

  submitAssignment() {
    if (this.attached_file_path == "") {
      this.addAssignment();
    } else {
      var currentName = this.attached_file_path.substr(this.attached_file_path.lastIndexOf('/') + 1);
      this.addMultipartAssignment(this.attached_file_path,currentName);
    }
  }

  addMultipartAssignment(fileURI,file_name): void {
    let deadline = this.replaceStringContent(this.replaceStringContent(this.startDate, "T", " "), "Z", "");
    console.log("deadline:-" + deadline);

    let deadlineDate = new Date(deadline);
    let currentDate = new Date();
    let difference = (deadlineDate.getTime() - currentDate.getTime()) / 1000;
    if (difference<120){
      // console.log("less than 2 min");
      this.presentToast("Time cannot be less than 2 min")
    }else{
      if (this.selectedSubjectPOJO == null) {
        this.presentToast("Please Select Subject");
        return;
      }

      if (this.selectedUniversityPOJO == null) {
        this.presentToast("Please Select University");
        return;
      }

      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

      var url = Constants.NEW_ORDER;

      const fileTransfer: FileTransferObject = this.fileTransfer.create();

      let options: FileUploadOptions = {
        fileKey: 'attachment[0]',
        fileName: file_name,
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
          'login_type': '1',
          'deadline': deadline,
          'subject': this.selectedSubjectPOJO.id,
          'university': this.selectedUniversityPOJO.id,
          'wordcount': this.word_count,
          'notes': this.comment
        }
      }

      fileTransfer.upload(fileURI, url, options)
        .then((data) => {

          loading.dismiss();

          console.log("result:-" + JSON.stringify(data));
          if (data.responseCode == 200) {
            // var parsedJSON=JSON.parse(JSON.stringify(data.response));
            var parsedJSON = JSON.parse(data.response);
            console.log("parsed json:-" + JSON.stringify(parsedJSON));
            if (parsedJSON.status == "success") {
              this.presentToast(parsedJSON.message);
              this.show_attached_file=false;
              this.word_count = "";
              this.selectedSubject = "Select Subject";
              this.selectedSubjectPOJO = null;
              this.selectedUniversity = "Select University";
              this.selectedUniversityPOJO = null;
              this.comment = "";
              this.attached_file_path = "";
              this.events.publish('menu_item_clicked','assignment_enquiries');
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
  }

  addAssignment(): void {

    let deadline = this.replaceStringContent(this.replaceStringContent(this.startDate, "T", " "), "Z", "");
    console.log("deadline:-" + deadline);

    let deadlineDate = new Date(deadline);
    let currentDate = new Date();
    let difference = (deadlineDate.getTime() - currentDate.getTime()) / 1000;
    if (difference<600){
      // console.log("less than 2 min");
      this.presentToast("Time cannot be less than 10 hours")
    }else{
      // console.log("greater than 2 min");
      if (this.selectedSubjectPOJO == null) {
        this.presentToast("Please Select Subject");
        return;
      }

      if (this.selectedUniversityPOJO == null) {
        this.presentToast("Please Select University");
        return;
      }

      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

      var url = Constants.NEW_ORDER;

      console.log("url:-" + url);
      let postdata = new FormData();
      postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
      postdata.append('device_name', 'Mi Note 7 Pro');
      postdata.append('device_os', 'android');
      postdata.append('language', 'en');
      postdata.append('location_lant', '234.3343434');
      postdata.append('location_long', '234.3343434');
      postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
      postdata.append('deadline', deadline);
      postdata.append('subject', this.selectedSubjectPOJO.id);
      postdata.append('university', this.selectedUniversityPOJO.id);
      postdata.append('wordcount', this.word_count);
      postdata.append('attachment', '');
      postdata.append('notes', this.comment);
      postdata.append('login_type', '1');


      Constants.printKeyValuePairs(url,postdata);

      console.log("user_id:-" + JSON.stringify(postdata.getAll("deadline")));
      // console.log("order_type:-" + JSON.stringify(postdata.getAll("order_type")));
      // console.log("login_type:-" + JSON.stringify(postdata.getAll("login_type")));

      this.http.post(url, postdata).subscribe(result => {
        loading.dismiss();
        try {
          console.log("data:-" + JSON.stringify(result));
          var parsedData = JSON.parse(JSON.stringify(result));
          if (parsedData.status == "success") {
            this.presentToast(parsedData.message);
            this.show_attached_file=false;
            this.word_count = "";
            this.selectedSubject = "Select Subject";
            this.selectedSubjectPOJO = null;
            this.selectedUniversity = "Select University";
            this.selectedUniversityPOJO = null;
            this.comment = "";
            this.attached_file_path="";
            this.events.publish('menu_item_clicked','assignment_enquiries');
          } else {
            this.presentToast(parsedData.message);
          }
        } catch (err) {
          console.log(err);
        }
      })

    }
  }

  chooseFile(): void {
    this.fileChooser.open()
      .then(uri => {
        console.log(uri);
        this.filePath.resolveNativePath(uri)
          .then((filePath) => {
            // alert(filePath);
            console.log("file path:-" + filePath);
            this.attached_file_path = filePath;
            this.show_attached_file=true;
            // this.show_attached_file=true;
          }, (err) => {
            console.log(err);
          })
      })
      .catch(e => console.log(e));

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

interface University {
  id: string;
  name: string;
  active: string;
  date: string;
  created_by: string;
  modified_by: string;
  modified_date: string;
}


interface Subject {
  id: string;
  parent: string;
  name: string;
  active: string;
  created_date: string;
  created_by: string;
  modified_date: string;
  modified_by: string;
}
