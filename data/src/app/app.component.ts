import {Component, ViewChild} from '@angular/core';
import {AlertController, Events, ModalController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import * as Constants from "../models/Constants";
import {FCM} from "@ionic-native/fcm";
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  submenuVisible: boolean = false;

  username: string = "User Name";
  profile_pic: string = "MAS";
  client_id: string = "";

  @ViewChild(Nav) nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events, modalCtrl: ModalController,
              private alertCtrl: AlertController,private fcm:FCM,private localNotifications:LocalNotifications) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // statusBar.overlaysWebView(true);

// set status bar to white
      statusBar.backgroundColorByHexString('#3e6199');

      statusBar.styleDefault();
      splashScreen.hide();

      // let splash = modalCtrl.create(SplashPage);
      // splash.present();

      this.startApplication();

      events.subscribe('start_application', (data) => {
        console.log("start_application:-" + data);
        // this.startApplication();
      });
      events.subscribe('set_profile', (data) => {
        // console.log("user login:-"+window.localStorage.getItem(Constants.USER_LOGIN));
        // console.log("user data:-"+window.localStorage.getItem(Constants.USER_LOGIN_DATA));

        if (window.localStorage.getItem(Constants.USER_LOGIN) == '1') {
          var jsonData = JSON.parse(window.localStorage.getItem(Constants.USER_LOGIN_DATA));
          console.log("user profile:-" + JSON.stringify(jsonData));
          this.username = jsonData.return_data.username;
          this.client_id = jsonData.return_data.user_unique_id;
          if (jsonData.return_data.image == "") {
            this.profile_pic = "assets/imgs/default_pic.png";
          } else {
            this.profile_pic = jsonData.return_data.image;
          }
          console.log("image:-" + jsonData.return_data.image);
        }
      });


      try{
        this.fcm.getToken().then(token => {
          console.log("token_get:-"+token);
          window.localStorage.setItem(Constants.DEVICE_TOKEN,token);
        });

        this.fcm.subscribeToTopic('marketing');

        this.fcm.onNotification().subscribe(data => {
          console.log("notification:-"+JSON.stringify(data));
          if(data.wasTapped){
            console.log("Received in background");
            console.log("background notification:-"+JSON.stringify(data));
          } else {
            var parsedData=JSON.parse(JSON.stringify("data"));
            this.localNotifications.schedule({
              id: 1,
              title:parsedData.body,
              text: parsedData.body,
              data: 'data coming'
            });
            console.log("Received in foreground");
          };
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          console.log("token_refresh:-"+token);
          window.localStorage.setItem(Constants.DEVICE_TOKEN,token);
        });
      }catch (e) {
        console.log(e);
      }


    });

    platform.registerBackButtonAction(() => {
      let view = this.nav.getActive();
      console.log("Componentname:-" + view.component.name);
      if (view.component.name == "HomePage") {
        let alert = this.alertCtrl.create({
          title: 'Exit Application?',
          message: 'Do you want to exit the application?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Exit',
              handler: () => {
                platform.exitApp();
                console.log('Exit clicked');
              }
            }
          ]
        });
        alert.present();
        console.log("back button pressed");
      } else if(view.component.name == "LoginPage"){
        platform.exitApp();
      }else {
        // if (view.component.name == "LoginPage"
        //   || view.component.name == "LoginMpinPage"
        //   || view.component.name == "ForgotPasswordPage"
        //   || view.component.name == "ValidateForgotMpinOtpPage"
        //   || view.component.name == "ResetMpinPage"
        //   || view.component.name == "ValidateForgotPasswordOtopPage"
        //   || view.component.name == "UpdatePasswordPage"
        // ) {
        //   this.nav.pop({});
          this.nav.pop();
        // } else {
        //   // this.rootPage=HomePage;
        //   this.nav.setRoot(HomePage);
        //
        // }
      }

    });


  }

  startApplication(): void {
    // console.log("profile data:-"+window.localStorage.getItem(Constants.USER_LOGIN_DATA));
    console.log("login status:-" + window.localStorage.getItem(Constants.USER_LOGIN));
    if (window.localStorage.getItem(Constants.USER_LOGIN) == '1') {
      this.rootPage = HomePage;
    } else {
      this.rootPage = LoginPage;
    }
    // this.rootPage = ProfilePage;
  }

  menuClicked(data): void {
    console.log("menu item clicked:-" + data);
    this.events.publish('menu_item_clicked', data);
    // this.events.publish('profile_menu_item_clicked', data);
    // this.events.publish('newassignment_menu_item_clicked', data);


  }

  assignmentSubMenu(): void {
    if (this.submenuVisible) {
      this.submenuVisible = false;
    } else {
      this.submenuVisible = true;
    }
  }


}

