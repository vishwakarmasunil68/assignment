import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the CountrySelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-country-select',
  templateUrl: 'country-select.html',
})
export class CountrySelectPage {

  callback: any;
  mainCountryPOJOS: Country[] = [];
  countryPOJOS: Country[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public http: HttpClient) {
    this.callback = this.navParams.get("callback")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad On Country select page');
    let countrylistString = window.localStorage.getItem(Constants.COUNTRY_LIST);
    // console.log("country list:-"+countrylistString);
    if (countrylistString == undefined || countrylistString == '') {
      this.getCountryList();
    }else{
      var parsedData = JSON.parse(countrylistString);
      this.parseCountryListData(parsedData);
    }
  }

  getCountryList() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    var url = Constants.GET_ALL_COUNTRIES;

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
      loading.dismiss();

      try {
        console.log("data:-" + JSON.stringify(result));

        // this.country_string = [];
        var parsedData = JSON.parse(JSON.stringify(result));
        this.parseCountryListData(parsedData);
      } catch (err) {
        console.log(err);
      }
    })
  }

  parseCountryListData(parsedData):void{
    try{
      console.log("parsed data status:-"+parsedData.status);
      if (parsedData.status == "success") {
        this.mainCountryPOJOS = [];
        this.countryPOJOS = [];
        this.presentToast(parsedData.message);
        for (let i = 0; i < parsedData.return_data.length; i++) {
          const country: Country = {
            id: parsedData.return_data[i].id,
            code: parsedData.return_data[i].code,
            country_code: parsedData.return_data[i].country_code,
            name: parsedData.return_data[i].name,
            modified_date: parsedData.return_data[i].modified_date,
            modified_by: parsedData.return_data[i].modified_by,
            status: parsedData.return_data[i].status,
            type: parsedData.return_data[i].type
          }

          // this.country_string.push(country.name);
          this.mainCountryPOJOS.push(country);
          this.countryPOJOS.push(country);
        }

      } else {
        this.presentToast(parsedData.message);
      }
    }catch (e) {
      console.log(e);
    }
  }


  passdata(country: Country): void {
    this.callback(country).then(() => {
      this.navCtrl.pop();
    });
  }

  onSearchInput(key) {
    console.log("key:-" + key);
    if (key == '') {
      this.countryPOJOS = this.mainCountryPOJOS;
    } else {
      this.countryPOJOS = [];
      for (let i = 0; i < this.mainCountryPOJOS.length; i++) {
        if (this.mainCountryPOJOS[i].name.toLowerCase().includes(key.toLowerCase())
          || this.mainCountryPOJOS[i].country_code.toLowerCase().includes(key.toLowerCase())
          || this.mainCountryPOJOS[i].code.toLowerCase().includes(key.toLowerCase())
        ) {
          this.countryPOJOS.push(this.mainCountryPOJOS[i]);
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

interface Country {
  id: string;
  code: string;
  country_code: string;
  name: string;
  modified_date: string;
  modified_by: string;
  status: string;
  type: string;
}
