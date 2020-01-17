import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '../../node_modules/@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {AssignmentListPage} from "../pages/assignment-list/assignment-list";
import {ExpiredAssignmentListPage} from "../pages/expired-assignment-list/expired-assignment-list";
import {NewAssignmentPage} from "../pages/new-assignment/new-assignment";
import {ProfilePage} from "../pages/profile/profile";
import {AssignmentDetailsPage} from "../pages/assignment-details/assignment-details";
import {ContactusPage} from "../pages/contactus/contactus";
import {SettingPage} from "../pages/setting/setting";
import {ReportProblemPage} from "../pages/report-problem/report-problem";
import {PrivacyPolicyPage} from "../pages/privacy-policy/privacy-policy";
import {NotificationListPage} from "../pages/notification-list/notification-list";
import {ForgotPasswordPage} from "../pages/forgot-password/forgot-password";
import {LoginMpinPage} from "../pages/login-mpin/login-mpin";
import {SplashPage} from "../pages/splash/splash";
import {Camera} from "@ionic-native/camera";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {FilePath} from "@ionic-native/file-path";
import {FileChooser} from "@ionic-native/file-chooser";
import {TicketClosePage} from "../pages/ticket-close/ticket-close";
import {ForgotMpinOtpPage} from "../pages/forgot-mpin-otp/forgot-mpin-otp";
import {ValidateForgotMpinOtpPage} from "../pages/validate-forgot-mpin-otp/validate-forgot-mpin-otp";
import {ResetMpinPage} from "../pages/reset-mpin/reset-mpin";
import {ValidateForgotPasswordOtopPage} from "../pages/validate-forgot-password-otop/validate-forgot-password-otop";
import {UpdatePasswordPage} from "../pages/update-password/update-password";
import {TestDateTimeComponentPage} from "../pages/test-date-time-component/test-date-time-component";

import {ChangePasswordPage} from "../pages/change-password/change-password";
import {HelpPage} from "../pages/help/help";
import {FCM} from "@ionic-native/fcm";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {CountrySelectPage} from "../pages/country-select/country-select";
import {SubjectSelectPage} from "../pages/subject-select/subject-select";
import {UniversitySelectPage} from "../pages/university-select/university-select";
import {LinkifyPipe} from "../models/LinkifyPipe";
import {SharedModule} from "./SharedModule";
import {RationModalPage} from "../pages/ration-modal/ration-modal";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {VerifyNowOrderPage} from "../pages/verify-now-order/verify-now-order";
// import {StarRatingModule} from "ionic3-star-rating";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    AssignmentListPage,
    ExpiredAssignmentListPage,
    NewAssignmentPage,
    ProfilePage,
    AssignmentDetailsPage,
    ContactusPage,
    SettingPage,
    ReportProblemPage,
    PrivacyPolicyPage,
    NotificationListPage,
    ForgotPasswordPage,
    LoginMpinPage,
    SplashPage,
    TicketClosePage,
    ForgotMpinOtpPage,
    ValidateForgotMpinOtpPage,
    ResetMpinPage,
    ValidateForgotPasswordOtopPage,
    UpdatePasswordPage,
    TestDateTimeComponentPage,
    ChangePasswordPage,
    HelpPage,
    CountrySelectPage,
    CountrySelectPage,
    SubjectSelectPage,
    UniversitySelectPage,
    LinkifyPipe,
    RationModalPage,
    VerifyNowOrderPage
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    }),

    // StarRatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AssignmentListPage,
    ExpiredAssignmentListPage,
    NewAssignmentPage,
    ProfilePage,
    AssignmentDetailsPage,
    ContactusPage,
    SettingPage,
    ReportProblemPage,
    PrivacyPolicyPage,
    NotificationListPage,
    ForgotPasswordPage,
    LoginMpinPage,
    SplashPage,
    TicketClosePage,
    ForgotMpinOtpPage,
    ValidateForgotMpinOtpPage,
    ResetMpinPage,
    ValidateForgotPasswordOtopPage,
    UpdatePasswordPage,
    TestDateTimeComponentPage,
    ChangePasswordPage,
    HelpPage,
    CountrySelectPage,
    SubjectSelectPage,
    UniversitySelectPage,
    RationModalPage,
    VerifyNowOrderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    AndroidPermissions,
    File,
    FileTransfer,
    FilePath,
    FileChooser,
    FCM,
    LocalNotifications,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
