import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as Constants from "../../models/Constants";

/**
 * Generated class for the SubjectSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subject-select',
  templateUrl: 'subject-select.html',
})
export class SubjectSelectPage {

  callback: any;
  mainSubjectPOJOS: Subject[] = [];
  subjectPOJOS: Subject[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public http: HttpClient) {
    this.callback = this.navParams.get("callback")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad On Country select page');
    let subjectListString = window.localStorage.getItem(Constants.SUBJECT_LIST);
    // console.log("country list:-"+countrylistString);
    if (subjectListString == undefined || subjectListString == '') {
      this.getAllSubjects();
    }else{
      var parsedData = JSON.parse(subjectListString);
      this.parseSubjects(parsedData);
    }
  }

  getAllSubjects(): void {

    var url = Constants.GET_ALL_SUBJECTS;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('login_type', '1');

    this.http.post(url, postdata).subscribe(result => {
      try {

        // console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));
        this.parseSubjects(parsedData);
      } catch (err) {
        console.log(err);
      }
    })
  }

  parseSubjects(parsedData):void{
    try{
      this.mainSubjectPOJOS = [];
      this.subjectPOJOS = [];
      if (parsedData.status == "success") {

        for (let i = 0; i < parsedData.return_data.length; i++) {

          const subject: Subject = {
            id: parsedData.return_data[i].id,
            parent: parsedData.return_data[i].parent,
            name: parsedData.return_data[i].name,
            active: parsedData.return_data[i].active,
            created_date: parsedData.return_data[i].created_date,
            created_by: parsedData.return_data[i].created_by,
            modified_date: parsedData.return_data[i].modified_date,
            modified_by: parsedData.return_data[i].modified_by
          }
          this.mainSubjectPOJOS.push(subject);
          this.subjectPOJOS.push(subject);
        }
      } else {
        this.presentToast(parsedData.message);
      }
    }catch (e) {
      console.log(e);
    }
  }

  passdata(subject: Subject): void {
    this.callback(subject).then(() => {
      this.navCtrl.pop();
    });
  }

  onSearchInput(key) {
    console.log("key:-" + key);
    if (key == '') {
      this.subjectPOJOS = this.mainSubjectPOJOS;
    } else {
      this.subjectPOJOS = [];
      for (let i = 0; i < this.mainSubjectPOJOS.length; i++) {
        if (this.mainSubjectPOJOS[i].name.toLowerCase().includes(key.toLowerCase())
        ) {
          this.subjectPOJOS.push(this.mainSubjectPOJOS[i]);
        }
      }
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

