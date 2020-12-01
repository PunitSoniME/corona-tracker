import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, AlertController, LoadingController } from '@ionic/angular';
import * as _ from 'lodash';
import { AllCountryData } from '../home/home.classes';
import { CoronaDataService } from './../services/corona-data.service';

@Component({
  selector: 'app-select-country',
  templateUrl: './select-country.component.html',
  styleUrls: ['./select-country.component.scss'],
})
export class SelectCountryComponent implements OnInit {

  search: string;
  sourceCountries: Array<object> = [];
  countries: Array<object> = [];

  constructor(
    private navParams: NavParams,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private coronaDataService: CoronaDataService
  ) {


  }

  async ngOnInit() {
    let loader = await this.loadingController.create({
      message: "Loading countries..."
    });

    loader.present();

    this.coronaDataService.getCountries().subscribe(allCountryDetails => {
      let selectedCountries = this.navParams.get('selectedCountries').map(e => e["country"]);

      let nonChecked = [];

      allCountryDetails.forEach((countryDetails: AllCountryData) => {

        if (selectedCountries.indexOf(countryDetails.country) > -1) {
          this.countries.push({
            "countryName": countryDetails.country,
            "flag": countryDetails.countryInfo.flag,
            "isChecked": true,
            "deaths": countryDetails.deaths
          });
        } else {
          nonChecked.push({
            "countryName": countryDetails.country,
            "flag": countryDetails.countryInfo.flag,
            "isChecked": false,
            "deaths": countryDetails.deaths
          });
        }
      });

      this.countries.push(...nonChecked);

      Object.assign(this.sourceCountries, this.countries);
      loader.dismiss();
    }, error => {
      loader.dismiss();
    });
  }


  filter() {
    this.countries = this.sourceCountries.filter((e) => {
      return e["countryName"].toLowerCase().indexOf(this.search.toLowerCase()) > -1;
    });
  }

  clear() {
    Object.assign(this.countries, this.sourceCountries);
  }

  saveFilter() {
    this.modalCtrl.dismiss({
      'selectedCountries': this.sourceCountries.filter(e => { return e["isChecked"] == true; }).map(e => e["countryName"]).sort()
    });
  }

  async clearSelection() {

    const alert = await this.alertController.create({
      header: 'Are You Sure ?',
      message: 'You want to clear all selection ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Yes',
          handler: () => {
            this.sourceCountries.forEach(country => {
              country["isChecked"] = false;
            });

            Object.assign(this.countries, this.sourceCountries);
          }
        }
      ]
    });

    await alert.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  sortSelectionChanged(event: CustomEvent) {
    const selectedSorting = event.detail.value;

    switch (selectedSorting) {
      case 'default':
        this.countries = _.orderBy(this.countries, ["isChecked"], ["desc"]);
        break;

      case 'asc':
        this.countries = _.orderBy(this.countries, ["countryName"], ["asc"]);
        break;

      case 'desc':
        this.countries = _.orderBy(this.countries, ["countryName"], ["desc"]);
        break;

      case 'deaths-low-high':
        this.countries = _.orderBy(this.countries, ["deaths"], ["asc"]);
        break;

      case 'deaths-high-low':
        this.countries = _.orderBy(this.countries, ["deaths"], ["desc"]);
        break;
    }
  }
}
