import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SubjectSelectPage} from "../subject-select/subject-select";

/**
 * Generated class for the TestDateTimeComponentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-date-time-component',
  templateUrl: 'test-date-time-component.html',
})
export class TestDateTimeComponentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestDateTimeComponentPage');
  }

  openCountryList():void{
    this.navCtrl.push(SubjectSelectPage, {
      callback: this.myCallbackFunction
    });
  }

  myCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      // this.test = _params;
      console.log("data got:-" + JSON.stringify(_params));
      // this.devicePOJO = _params;
      // this.deviceName = _params.objectDetail.name;
      // this.imei=_params.objectDetail.imei;
      resolve();
    });
  }

}
