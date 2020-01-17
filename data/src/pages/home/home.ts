import {Component, ViewChild} from '@angular/core';
import {AlertController, Events, MenuController, NavController, Tabs, ViewController} from 'ionic-angular';
import {AssignmentListPage} from "../assignment-list/assignment-list";
import {NewAssignmentPage} from "../new-assignment/new-assignment";
import {ProfilePage} from "../profile/profile";
import {AssignmentDetailsPage} from "../assignment-details/assignment-details";
import {ContactusPage} from "../contactus/contactus";
import {SettingPage} from "../setting/setting";
import {NotificationListPage} from "../notification-list/notification-list";
import {LoginPage} from "../login/login";
import * as Constants from "../../models/Constants";
import {HttpClient} from "@angular/common/http";
import {HelpPage} from "../help/help";
import {VerifyNowOrderPage} from "../verify-now-order/verify-now-order";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab2Root = AssignmentListPage;
  tab1Root = AssignmentListPage;
  tab3Root = AssignmentListPage;
  tab4Root = AssignmentListPage;

  @ViewChild('tabs') tab: Tabs;

  is_closed = false;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public events: Events, public viewCtrl: ViewController, public http: HttpClient,public alertCtrl:AlertController) {

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    events.subscribe('tab_clicked', (data) => {
      console.log("tab_clicked:-" + data);
      this.menuCtrl.close();
      switch (data) {
        case "open_menu":
          this.openMenu();
          break;
        case "profile":
          break;
        case "setting":
          this.navCtrl.push(SettingPage);
          break;
        case "view_assignment":
          this.viewAssignmentDetail();
          break;
        case "notifications":
          this.navCtrl.push(NotificationListPage);
          break;
        case "verify_assignment":
          this.navCtrl.push(VerifyNowOrderPage);
          break;
      }
    });

    this.events.subscribe('tab_selection', (data) => {
      console.log("tab_selection list:-" + data);
      setTimeout(() => {
        switch (data) {
          case "enquiries":
            this.tab.select(1);
            break;
          case "in_process":
            this.tab.select(0);
            break;
          case "delivered":
            this.tab.select(1);
            break;
          case "expired":
            this.tab.select(4);
            break;
        }
      }, 2000);

    });

    console.log('subscribing to event menu_item_clicked');
    events.subscribe('menu_item_clicked', (data) => {
      console.log("menu_item_clicked:-" + data);
      this.menuCtrl.close();
      switch (data) {
        case "profile":
          this.navCtrl.push(ProfilePage);
          // this.navCtrl.setRoot(ProfilePage);
          break;
        case "assignment_enquiries":
          // this.navCtrl.setRoot(HomePage);
          this.clearToRoot();
          this.tab.select(1);
          // this.events.publish('tab_selection','enquiries');
          break;
        case "assignment_in_process":
          // this.navCtrl.setRoot(HomePage);
          this.clearToRoot();
          this.tab.select(0);
          // this.events.publish('tab_selection','in_process');
          break;
        case "assignment_delivered":
          // this.navCtrl.setRoot(HomePage);
          this.clearToRoot();
          this.tab.select(2);
          // this.events.publish('tab_selection','delivered');
          // setTimeout( () => {
          //   this.tab.select(2);
          // }, 2000);

          break;
        case "assignment_expired":
          // this.navCtrl.setRoot(HomePage);
          this.clearToRoot();
          this.tab.select(3);
          // this.events.publish('tab_selection','expired');
          break;
        case "new_assignment":
          this.newAssignment();
          break;
        case "setting":
          this.navCtrl.push(SettingPage);
          // this.navCtrl.setRoot(SettingPage);
          break;
        case "contact_us":
          this.navCtrl.push(ContactusPage);
          break;
        case "help":
          this.navCtrl.push(HelpPage);
          break;
        case "logout":
          this.logoutUser();
          break;
      }
    });
    console.log('place_order');
    events.subscribe('place_order', (data) => {
      console.log("place_order:-" + data);
      this.newAssignment();
    });

    this.events.publish('set_profile', 'set_profile');
    let county_status = window.localStorage.getItem(Constants.IS_COUNTRY_LOADED);
    if (county_status == undefined || county_status == "" || county_status == "0") {
      this.getCountryList();
    }
    let subject_status = window.localStorage.getItem(Constants.IS_SUBJECT_LOADED);
    if (subject_status == undefined || subject_status == "" || subject_status == "0") {
      this.getAllSubjects();
    }
    let university_status = window.localStorage.getItem(Constants.IS_UNIVERSITY_LOADED);
    if (university_status == undefined || university_status == "" || university_status == "0") {
      this.getAllUniversities();
    }


    console.log("user_id:-"+window.localStorage.getItem(Constants.USER_ID));

  }

  clearToRoot(): void {
    for (let i = 0; i < this.navCtrl.length(); i++) {
      let v = this.navCtrl.getViews()[i];
      console.log(v.component.name);
      if (v.component.name != "HomePage") {
        this.navCtrl.pop();
      }
    }
  }

  logoutUser(): void {

    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Do you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log("back button pressed");

            window.localStorage.setItem(Constants.USER_LOGIN_DATA, "");
            window.localStorage.setItem(Constants.USER_ID, "");
            window.localStorage.setItem(Constants.USER_LOGIN, "0");
            window.localStorage.setItem(Constants.IS_COUNTRY_LOADED, "0");
            window.localStorage.setItem(Constants.IS_SUBJECT_LOADED, "0");
            window.localStorage.setItem(Constants.IS_UNIVERSITY_LOADED, "0");
            this.navCtrl.setRoot(LoginPage);
            console.log('Exit clicked');
          }
        }
      ]
    });
    alert.present();

  }

  timer: any;

  startTimer(position) {
    // this.timer = setTimeout(x =>
    // {
    //   this.tab.select(position);
    // }, 1000);
  }

  ionViewDidLeave() {
    this.is_closed = true;
    // this.events.unsubscribe('menu_item_clicked');
  }

  openProfile(): void {
    this.navCtrl.push(ProfilePage);
  }

  openMenu(): void {
    console.log("open menu");
    this.menuCtrl.open();
  }

  newAssignment(): void {
    this.navCtrl.push(NewAssignmentPage);
  }

  viewAssignmentDetail(): void {
    this.navCtrl.push(AssignmentDetailsPage);
  }

  getItems(data) {
    console.log("search data:-" + data);
  }

  getCountryList() {
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
      try {
        console.log("data:-" + JSON.stringify(result));
        window.localStorage.setItem(Constants.COUNTRY_LIST, JSON.stringify(result));
        window.localStorage.setItem(Constants.IS_COUNTRY_LOADED, "1");
      } catch (err) {
        console.log(err);
      }
    })
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
        window.localStorage.setItem(Constants.UNIVERSITY_LIST, JSON.stringify(result));
        window.localStorage.setItem(Constants.IS_UNIVERSITY_LOADED, "1");
      } catch (err) {
        console.log(err);
      }
    })
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
        console.log("data:-" + JSON.stringify(result));
        // var parsedData = JSON.parse(JSON.stringify(result));
        window.localStorage.setItem(Constants.SUBJECT_LIST, JSON.stringify(result));
        window.localStorage.setItem(Constants.IS_SUBJECT_LOADED, "1");
      } catch (err) {
        console.log(err);
      }
    })
  }


}
