import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as Constants from "../../models/Constants";

/**
 * Generated class for the UniversitySelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-university-select',
  templateUrl: 'university-select.html',
})
export class UniversitySelectPage {

  callback: any;
  mainUniversityPOJOS: University[] = [];
  universityPOJOS: University[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public http: HttpClient) {
    this.callback = this.navParams.get("callback")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad On Country select page');
    let universityListString = window.localStorage.getItem(Constants.UNIVERSITY_LIST);
    // console.log("country list:-"+countrylistString);
    if (universityListString == undefined || universityListString == '') {
      this.getAllUniversities();
    }else{
      var parsedData = JSON.parse(universityListString);
      this.parseUniversity(parsedData);
    }
  }

  getAllUniversities(): void {

    var url = Constants.GET_ALL_UNIVERSITY;

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

        console.log("data:-" + JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));
        this.parseUniversity(parsedData);
      } catch (err) {
        console.log(err);
      }
    })
  }

  parseUniversity(parsedData):void{
    try{
      this.mainUniversityPOJOS = [];
      this.universityPOJOS = [];
      if (parsedData.status == "success") {

        for (let i = 0; i < parsedData.return_data.length; i++) {
          const university: University = {
            id: parsedData.return_data[i].id,
            name: parsedData.return_data[i].name,
            active: parsedData.return_data[i].active,
            date: parsedData.return_data[i].date,
            created_by: parsedData.return_data[i].created_by,
            modified_by: parsedData.return_data[i].modified_by,
            modified_date: parsedData.return_data[i].modified_date
          }

          this.mainUniversityPOJOS.push(university);
          this.universityPOJOS.push(university);
        }
      } else {
        this.presentToast(parsedData.message);
      }
    }catch (e) {
      console.log(e);
    }
  }

  passdata(university: University): void {
    this.callback(university).then(() => {
      this.navCtrl.pop();
    });
  }

  onSearchInput(key) {
    console.log("key:-" + key);
    if (key == '') {
      this.universityPOJOS = this.mainUniversityPOJOS;
    } else {
      this.universityPOJOS = [];
      for (let i = 0; i < this.mainUniversityPOJOS.length; i++) {
        if (this.mainUniversityPOJOS[i].name.toLowerCase().includes(key.toLowerCase())
        ) {
          this.universityPOJOS.push(this.mainUniversityPOJOS[i]);
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

interface University {
  id: string;
  name: string;
  active: string;
  date: string;
  created_by: string;
  modified_by: string;
  modified_date: string;
}


