import {ToastController, LoadingController} from "ionic-angular";

export class BaseComp {

  presentToast(toastCtrl: ToastController, message: string) {
    let toast = toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  loadingComp(loadingCtrl: LoadingController) {
    let loading = loadingCtrl.create({
      content: 'Please wait...'
    });

    return loading;
  }

  saveItem(key, value) {
    window.localStorage.setItem(key, value);
  }

  getItem(key) {
    return window.localStorage.getItem(key);
  }

  printKeyValuePairs(url: string, postdata) {
    console.log('url:-' + url);
    console.log('--------------FORM DATA---------------');
    let data = "";
    postdata.forEach((value, key) => {
      // console.log(key + ':' + value)
      data += key + ':' + value + "\n";
    });
    console.log(data);
    console.log('--------------FORM DATA---------------');
  }

  getCurrentDateYYYYMMDD() {
    var currentDate = new Date()
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    var day_str = "";

    if (day < 10) {
      day_str = "0" + day;
    } else {
      day_str = "" + day;
    }

    var month_str = "";
    if (month < 10) {
      month_str = "0" + month;
    } else {
      month_str = "" + month;
    }
    let date_str = year + "-" + month_str + "-" + day_str;
    return date_str;
  }

  getDifferenceBtwTwoDates(date_str_1, date_str_2) {
    var date1 = new Date(date_str_1);
    var date2 = new Date(date_str_2);
    var Difference_In_Days = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  getOnlyDate(date) {
    return date.split(" ")[0];
  }
}
