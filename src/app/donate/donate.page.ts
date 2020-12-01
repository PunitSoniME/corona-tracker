import { Component, OnInit } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { v4 as uuidv4 } from 'uuid';
import { environment } from './../../environments/environment';
import { ActionSheetController, ToastController } from '@ionic/angular';
import * as _ from 'lodash';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.page.html',
  styleUrls: ['./donate.page.scss'],
})
export class DonatePage implements OnInit {

  amount: number;
  currencyType: string;
  description: string;
  currencies: Array<object> = [];

  constructor(
    private payPal: PayPal,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private clipboard: Clipboard
  ) {
    this.currencies = [
      { value: "Australian dollar", code: "AUD" },
      { value: "Brazilian real", code: "BRL" },
      { value: "Canadian dollar", code: "CAD" },
      { value: "Czech koruna", code: "CZK" },
      { value: "Danish krone", code: "DKK" },
      { value: "Euro", code: "EUR" },
      { value: "Hong Kong dollar", code: "HKD" },
      { value: "Hungarian forint", code: "HUF" },
      { value: "Indian rupee", code: "INR" },
      { value: "Israeli new shekel", code: "ILS" },
      { value: "Japanese yen", code: "JPY" },
      { value: "Malaysian ringgit", code: "MYR" },
      { value: "Mexican peso", code: "MXN" },
      { value: "New Taiwan dollar", code: "TWD" },
      { value: "New Zealand dollar", code: "NZD" },
      { value: "Norwegian krone", code: "NOK" },
      { value: "Philippine peso", code: "PHP" },
      { value: "Polish złoty", code: "PLN" },
      { value: "Pound sterling", code: "GBP" },
      { value: "Russian ruble", code: "RUB" },
      { value: "Singapore dollar", code: "SGB" },
      { value: "Swedish krona", code: "SEK" },
      { value: "Swiss franc", code: "CHF" },
      { value: "Thai baht", code: "THB" },
      { value: "United States dollar", code: "USD" }
    ];
  }

  ngOnInit() {
  }

  async openPaymentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pay Via',
      buttons: [{
        text: 'PayPal',
        icon: 'cash-outline',
        handler: () => {
          this.payPalPayment();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }

  payPalPayment() {

    this.payPal.init({
      PayPalEnvironmentProduction: '',  //  environment.payPalLive,
      PayPalEnvironmentSandbox: ''  //  environment.payPalSandbox
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.amount.toString(), this.currencyType, 'Description', this.description);
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });

    // const uniqId = uuidv4();
    // const options = {
    //   action: this.webIntent.ACTION_VIEW,
    //   url: 'upi://pay?pa=9725620501@upi&pn=PunitSoni&tid=' + uniqId,
    // }

    // this.webIntent.startActivity(options).then((success) => {

    // }, (error) => {

    // });
  }

  async copy(upi: string) {
    switch (upi) {
      case 'paytm':
        this.clipboard.copy("");
        break;

      case 'phonepe':
        this.clipboard.copy("");
        break;

      case 'amazon':
        this.clipboard.copy("");
        break;
    }


    const toast = await this.toastController.create({
      message: `Upi copied successfully. Please open relevant app to donate and motivate our team`,
      duration: 5000
    });

    toast.present();

  }
}
