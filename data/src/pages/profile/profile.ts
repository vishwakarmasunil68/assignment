import {Component} from '@angular/core';
import {
  ActionSheetController, Events,
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {NewAssignmentPage} from "../new-assignment/new-assignment";
import {HttpClient} from "@angular/common/http";
import * as Constants from '../../models/Constants';
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {CountrySelectPage} from "../country-select/country-select";
import {FilePath} from "@ionic-native/file-path";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  // name:string="Sunil Vishwakarma";
  // email:string="sundroid1993@gmail.com";
  // phone:string="+91 9873738969";
  // address:string="Malviya Nagar";
  // city:string="New Delhi";
  // country:string="India";

  name: string = "";
  email: string = "";
  phone: string = "";
  address: string = "";
  date_of_birth: string = "Date";

  gender_male: boolean = true;
  gender_female: boolean = false;
  gender_others: boolean = false;

  countryList: Country[] = [];
  selectedCountry: Country = null;
  selectedCountryName: string = "Select Country";

  DEFAULT_PIC: string = "assets/imgs/default_pic.png";

  profile_pic: string = this.DEFAULT_PIC;

  // country_string: string[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private androidPermissions: AndroidPermissions,
              public menuCtrl: MenuController, public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public http: HttpClient, private camera: Camera, private fileTransfer: FileTransfer, private actionSheetCtrl: ActionSheetController,
              private events: Events,private filePath:FilePath) {
    this.date_of_birth = "2000-01-01T23:59:00Z";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    // this.checkCameraPermission();
    // this.checkLocationPermission();
    // this.getCountryList();

    let countrylistString = window.localStorage.getItem(Constants.COUNTRY_LIST);
    // console.log("country list:-"+countrylistString);
    if (countrylistString == undefined || countrylistString == '') {
      this.getCountryList();
    } else {
      var parsedData = JSON.parse(countrylistString);
      this.parseCountryListData(parsedData, false);
      this.loadProfileData();
    }

  }

  checkCameraPermission(): void {
    console.log("checking camera permission");
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => {
        console.log("has permission");
        console.log('Has permission?', result.hasPermission)
      },
      err => {
        console.log("no permission");
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      }
    );
  }

  checkLocationPermission(): void {
    console.log("checking location permission");
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        console.log("has permission");
        console.log('Has permission?', result.hasPermission)
      },
      err => {
        console.log("no permission");
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      }
    );
  }

  openMenu(): void {
    this.menuCtrl.open();
  }

  openActionSheet(): void {

  }

  presentActionSheet(): void {

    var parseJSON=JSON.parse(window.localStorage.getItem(Constants.USER_LOGIN_DATA));

    if(parseJSON.return_data.image==""){
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Profile pic options',
        buttons: [
          {
            text: 'Open Gallery',
            role: 'Open Gallery',
            handler: () => {
              console.log('Gallery clicked');
              this.openGallery();
            }
          },
          {
            text: 'Open Camera',
            role: 'Open Camera',
            handler: () => {
              console.log('Profile pic clicked');
              this.openCamera();
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }else{
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Choose',
        buttons: [
          {
            text: 'Open Gallery',
            role: 'Open Gallery',
            handler: () => {
              console.log('Gallery clicked');
              this.openGallery();
            }
          },
          {
            text: 'Open Camera',
            role: 'Open Camera',
            handler: () => {
              console.log('Profile pic clicked');
              this.openCamera();
            }
          },
          {
            text: 'Remove Photo',
            handler: () => {
              this.removeProfilePic();
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }


  }

  removeProfilePic(): void {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    var url = Constants.REMOVE_PROFILE_PIC;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('login_type', '1');
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      try {
        console.log("data:-" + JSON.stringify(result));
        // this.country_string = [];
        var parsedData = JSON.parse(JSON.stringify(result));
        if (parsedData.status == "success") {
          window.localStorage.setItem(Constants.USER_LOGIN_DATA, JSON.stringify(result));
          this.presentToast(parsedData.message);
          this.profile_pic = this.DEFAULT_PIC;
          this.events.publish('set_profile', 'set_profile');
        } else {
          this.presentToast(parsedData.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  openGallery(): void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imagePath) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imagePath;

      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          console.log("resolve filepath:-"+filePath);
          var currentName = filePath.substr(filePath.lastIndexOf('/') + 1);
          var correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);

          console.log("currentName:-" + currentName);
          console.log("correctPath:-" + correctPath);

          this.uploadProfilepic(filePath, currentName);
        })
        .catch(err => console.log(err));

      // console.log("base image:-" + imagePath);



    }, (err) => {
      // Handle error
      console.log("Error:-" + err);
    });
  }

  openCamera(): void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imagePath) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imagePath;
      console.log("base image:-" + base64Image);

      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

      console.log("currentName:-" + currentName);
      console.log("correctPath:-" + correctPath);

      this.uploadProfilepic(imagePath, currentName);

    }, (err) => {
      // Handle error
      console.log("Error:-" + err);
    });
  }

  uploadFile(imageURI): void {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    let options: FileUploadOptions = {
      fileKey: 'profile_pic',
      fileName: 'profile_pic',
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {'param1': 'param1passed', 'param2': 'param2passed'}
    }

    fileTransfer.upload(imageURI, 'http://182.76.245.4:8002/horse/index.php/UploadTest/uploadFiles', options)
      .then((data) => {
        console.log("result:-" + JSON.stringify(data));
        console.log(data + " Uploaded Successfully");
        // this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
        loader.dismiss();
        this.presentToast("Image uploaded successfully");
      }, (err) => {
        console.log(err);
        loader.dismiss();
        this.presentToast(err);
      });
  }


  uploadProfilepic(imageURI, file_name): void {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    let options: FileUploadOptions = {
      fileKey: 'profile_img',
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
        'login_type': '1'
      }
    }

    fileTransfer.upload(imageURI, Constants.UPDATE_PROFILE_PIC, options)
      .then((data) => {

        loader.dismiss();

        console.log("result:-" + JSON.stringify(data));
        if (data.responseCode == 200) {
          // var parsedJSON=JSON.parse(JSON.stringify(data.response));
          var parsedJSON = JSON.parse(data.response);
          console.log("parsed json:-" + JSON.stringify(parsedJSON));
          if (parsedJSON.status == "success") {
            window.localStorage.setItem(Constants.USER_LOGIN_DATA, JSON.stringify(data.response));
            window.localStorage.setItem(Constants.USER_ID, parsedJSON.return_data.id);
            if(parsedJSON.return_data.image==""){
              this.profile_pic=this.DEFAULT_PIC;
            }else{
              this.profile_pic=parsedJSON.return_data.image;
            }
            this.presentToast("Profile Pic Uploaded Successfully");
            this.events.publish('set_profile', 'set_profile');
          } else {
            this.presentToast(parsedJSON.message);
          }
        } else {
          this.presentToast("Something went wrong")
        }
        // this.presentToast("Image uploaded successfully");
      }, (err) => {
        console.log(err);
        loader.dismiss();
        this.presentToast(err);
      });
  }

  newAssignment(): void {
    this.navCtrl.push(NewAssignmentPage);
  }

  maleGenderClicked(): void {
    if (this.gender_male) {
      this.gender_female = false;
      this.gender_others = false;
    }
  }

  femaleGenderClicked(): void {
    if (this.gender_female) {
      this.gender_male = false;
      this.gender_others = false;
    }
  }

  otherGenderClicked(): void {
    if (this.gender_others) {
      this.gender_male = false;
      this.gender_female = false;
    }
  }

  setMale() {
    console.log("changing gender");
    this.gender_male = true;
    this.gender_female = false;
    this.gender_others = false;
  }

  setFemale() {
    console.log("changing gender");
    this.gender_male = false;
    this.gender_female = true;
    this.gender_others = false;
  }

  setOthers() {
    console.log("changing gender");
    this.gender_male = false;
    this.gender_female = false;
    this.gender_others = true;
  }

  checkGender(value: string): void {
    console.log("value:-" + value);

    // switch (value) {
    //   case "male":
    //     this.gender_male = true;
    //     this.gender_female = false;
    //     this.gender_others = false;
    //     break;
    //
    //   case "female":
    //     this.gender_male = false;
    //     this.gender_female = true;
    //     this.gender_others = false;
    //     break;
    //
    //   case "other":
    //     this.gender_male = false;
    //     this.gender_female = false;
    //     this.gender_others = true;
    //     break;
    //
    // }

    if (this.gender_male) {
      this.gender_female = false;
      this.gender_others = false;
    }

    if (this.gender_female) {
      this.gender_male = false;
      this.gender_others = false;
    }

    if (this.gender_others) {
      this.gender_male = false;
      this.gender_female = false;
    }

    console.log("gender male:-" + this.gender_male);
    console.log("gender female:-" + this.gender_female);
    console.log("gender others:-" + this.gender_others);
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
      this.countryList = [];
      try {
        console.log("data:-" + JSON.stringify(result));

        // this.country_string = [];
        var parsedData = JSON.parse(JSON.stringify(result));
        this.parseCountryListData(parsedData, true);
      } catch (err) {
        console.log(err);
      }
    })
  }

  parseCountryListData(parsedData, load_profile: boolean): void {
    try {
      console.log("parsed data status:-" + parsedData.status);
      if (parsedData.status == "success") {
        this.countryList = [];
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

          this.countryList.push(country);
        }
        console.log("Country length:-" + this.countryList.length);
        if (load_profile) {
          this.getProfileInfo();
        }
      } else {
        this.presentToast(parsedData.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  loadProfileData(): void {
    try {
      let profileString = window.localStorage.getItem(Constants.USER_LOGIN_DATA);
      this.parseProfileINFO(JSON.parse(profileString));
    } catch (e) {
      console.log(e);
    }
  }

  getProfileInfo(): void {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

    var url = Constants.GET_USER_PROFILE;

    console.log("url:-" + url);
    let postdata = new FormData();
    postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
    postdata.append('device_name', 'Mi Note 7 Pro');
    postdata.append('device_os', 'android');
    postdata.append('language', 'en');
    postdata.append('location_lant', '234.3343434');
    postdata.append('location_long', '234.3343434');
    postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
    postdata.append('login_type', '1');

    console.log("post data:-" + JSON.stringify(postdata.getAll("user_id")));

    this.http.post(url, postdata).subscribe(result => {
      loading.dismiss();
      try {
        console.log("data:-" + JSON.stringify(result));
        window.localStorage.setItem(Constants.USER_LOGIN_DATA, JSON.stringify(result));
        var parsedData = JSON.parse(JSON.stringify(result));
        this.parseProfileINFO(parsedData);
      } catch (err) {
        console.log(err);
      }
    })
  }

  parseProfileINFO(parsedData) {
    try {
      if (parsedData.status == "success") {


        window.localStorage.setItem(Constants.USER_ID, parsedData.return_data.id);

        this.name = parsedData.return_data.username;
        this.email = parsedData.return_data.email;
        this.phone = parsedData.return_data.phone;
        this.address = parsedData.return_data.address;
        if (parsedData.return_data.dob == '0000-00-00') {
          this.date_of_birth = "";
        } else {
          this.date_of_birth = parsedData.return_data.dob;
        }

        console.log("dob:-" + this.date_of_birth);

        switch (parsedData.return_data.gender) {
          case "1":
            this.gender_male = true;
            this.gender_female = false;
            this.gender_others = false;
            break;

          case "2":
            this.gender_male = false;
            this.gender_female = true;
            this.gender_others = false;
            break;

          case "3":
            this.gender_male = false;
            this.gender_female = false;
            this.gender_others = true;
            break;
        }


        if (parsedData.return_data.image == "") {
          this.profile_pic = this.DEFAULT_PIC;
        } else {
          this.profile_pic = parsedData.return_data.image;
        }

        for (let i = 0; i < this.countryList.length; i++) {
          if (this.countryList[i].id == parsedData.return_data.country) {
            this.selectedCountryName = this.countryList[i].name;
            this.selectedCountry = this.countryList[i];
          }
        }

        console.log("Country name:-" + this.selectedCountry);
      } else {
        this.presentToast(parsedData.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  openSelectCountryPage(): void {
    this.navCtrl.push(CountrySelectPage, {
      callback: this.countryCallBackFunction
    });
  }

  countryCallBackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      console.log("data got:-" + JSON.stringify(_params));
      const callBackCountry: Country = {
        id: _params.id,
        code: _params.code,
        country_code: _params.country_code,
        name: _params.name,
        modified_date: _params.modified_date,
        modified_by: _params.modified_by,
        status: _params.status,
        type: _params.type
      }
      this.selectedCountry = callBackCountry;
      this.selectedCountryName = callBackCountry.name;
      resolve();
    });
  }

  updateProfile(): void {
    if (this.name != '' && this.email != '' && this.phone != '' && this.date_of_birth != '' && this.selectedCountry != null) {
      // if (this.name != '' && this.email != '' && this.phone != '' && this.date_of_birth != '' ) {
      if (this.gender_male || this.gender_female || this.gender_others) {
        console.log("dob:-" + this.date_of_birth);

        let gender = "1";

        if (this.gender_male) {
          gender = "1";
        } else if (this.gender_female) {
          gender = "2";
        } else if (this.gender_others) {
          gender = "3";
        }

        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });

        loading.present();

        console.log("user_id:-" + window.localStorage.getItem(Constants.USER_ID));

        var url = Constants.UPDATE_PROFILE;

        console.log("url:-" + url);
        let postdata = new FormData();
        postdata.append('device_token', window.localStorage.getItem(Constants.DEVICE_TOKEN));
        postdata.append('device_name', 'Mi Note 7 Pro');
        postdata.append('device_os', 'android');
        postdata.append('language', 'en');
        postdata.append('location_lant', '234.3343434');
        postdata.append('location_long', '234.3343434');
        postdata.append('user_id', window.localStorage.getItem(Constants.USER_ID));
        postdata.append('name', this.name);
        postdata.append('gender', gender);
        postdata.append('date_of_birth', this.date_of_birth);
        postdata.append('country', this.selectedCountry.id);
        postdata.append('email', this.email);
        postdata.append('phone', this.phone);
        // postdata.append('profile_img', this.name);
        postdata.append('login_type', '1');


        console.log("post data:-" + JSON.stringify(postdata.getAll("user_id")));

        this.http.post(url, postdata).subscribe(result => {
          loading.dismiss();
          try {
            console.log("data:-" + JSON.stringify(result));
            window.localStorage.setItem(Constants.USER_LOGIN_DATA, JSON.stringify(result));
            var parsedData = JSON.parse(JSON.stringify(result));
            if (parsedData.status == "success") {
              this.presentToast(parsedData.message);

              this.name = parsedData.return_data.username;
              this.email = parsedData.return_data.email;
              this.phone = parsedData.return_data.phone;
              this.address = parsedData.return_data.address;
              // this.city=parsedData.return_data.username;

              if (parsedData.return_data.image == "") {
                this.profile_pic = this.DEFAULT_PIC;
              } else {
                this.profile_pic = parsedData.return_data.image;
              }

              for (let i = 0; i < this.countryList.length; i++) {
                if (this.countryList[i].id == parsedData.return_data.country) {
                  this.selectedCountryName = this.countryList[i].name;
                  this.selectedCountry = this.countryList[i];
                }
              }

              switch (parsedData.return_data.gender) {
                case "1":
                  this.gender_male = true;
                  this.gender_female = false;
                  this.gender_others = false;
                  break;

                case "2":
                  this.gender_male = false;
                  this.gender_female = true;
                  this.gender_others = false;
                  break;

                case "3":
                  this.gender_male = false;
                  this.gender_female = false;
                  this.gender_others = true;
                  break;

              }
            } else {
              this.presentToast(parsedData.message);
            }
          } catch (err) {
            console.log(err);
          }
        })
      } else {
        this.presentToast("Please Select Your Gender");
      }
    } else {
      this.presentToast("Please Fill All Details Properly");
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
