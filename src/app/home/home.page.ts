import { Component, OnInit, ViewChild } from '@angular/core';
import { CoronaDataService } from './../services/corona-data.service';
import { LoadingController, ModalController, ActionSheetController, IonContent } from '@ionic/angular';
import { SpecificCountryData, AllCountryData, WorldData } from './home.classes';
import { SelectCountryComponent } from './../select-country/select-country.component';
import * as _ from 'lodash';
import { FormBuilder } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('scrollElement', { static: false }) content: IonContent;

  activeIndex = 0;

  oldHashTag: string;
  currentHashTag: string;
  nextResults: string;
  tweets = [];

  userForm: any;
  worldLoadingController: any;

  homeCountriesSelection = [];
  worldData: WorldData;
  homeCountryDetails: AllCountryData;
  onlyCountryNames: Array<string> = [];
  countries: Array<AllCountryData> = [];
  selectedCountriesData: Array<AllCountryData> = [];

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private coronaDataService: CoronaDataService,
    private iab: InAppBrowser
  ) {

  }

  ngOnInit() {
    this.loadData();
  }

  refreshData() {
    if (this.activeIndex == 0 || this.activeIndex == 1) {
      this.loadData();
    } else {
      if (this.currentHashTag) {
        this.getTweets();
      }
    }
  }

  async loadData() {
    this.onlyCountryNames = [];
    this.homeCountriesSelection = [];

    this.worldLoadingController = await this.loadingController.create({
      message: "Getting World Data..."
    });
    this.worldLoadingController.present();

    this.coronaDataService.getCountries().subscribe((countries: Array<AllCountryData>) => {
      this.countries = _.sortBy(countries, "country");

      this.countries.forEach(country => {
        this.onlyCountryNames.push(country.country);

        country.recoveredPercentage = ((country.recovered / country.cases) * 100).toFixed(2);
        country.deathsPercentage = ((country.deaths / country.cases) * 100).toFixed(2);

        this.homeCountriesSelection.push({
          "text": country.country,
          handler: () => {
            this.homeCountryDetails = country;
            localStorage.setItem("HomeCountry", JSON.stringify(country.country));
          }
        });

        if (localStorage.getItem("HomeCountry")) {
          const countryName = JSON.parse(localStorage.getItem("HomeCountry"));
          this.homeCountryDetails = _.find(this.countries, (country) => {
            return country.country == countryName;
          })
        }
      });

      this.homeCountriesSelection.push({
        text: 'Cancel',
        //  icon: 'close',
        role: 'cancel'
      })

      this.onlyCountryNames = this.onlyCountryNames.sort();
      this.selectedCountriesData = [];

      if (localStorage.getItem("SelectedCountries")) {
        let selectedCountries = JSON.parse(localStorage.getItem("SelectedCountries"));

        this.countries.forEach(country => {
          if (selectedCountries.indexOf(country.country) > -1) {
            this.selectedCountriesData.push(country);
          }
        });
      }

      this.getDashboardData();
    }, error => {
      this.worldLoadingController.dismiss();
    });
  }

  async getDashboardData() {

    this.coronaDataService.getCurrentCases().subscribe(async worldData => {
      this.worldData = worldData;

      this.worldData.recoveredPercentage = ((this.worldData.recovered / this.worldData.cases) * 100).toFixed(2);
      this.worldData.deathsPercentage = ((this.worldData.deaths / this.worldData.cases) * 100).toFixed(2);

      this.worldLoadingController.dismiss();
      // if (event) {
      //   event.target.complete();
      // }
    });
  }

  async selectCountryModal() {
    const modal = await this.modalController.create({
      component: SelectCountryComponent,
      componentProps: {
        //  'allCountryDetails': this.countries,
        'selectedCountries': this.selectedCountriesData
      }
    });

    modal.present();

    modal.onWillDismiss().then((response) => {
      if (response.data) {
        var selectedCountries = response.data.selectedCountries;
        this.selectedCountriesData = [];

        if (selectedCountries.length > 0) {
          this.countries.forEach(country => {
            if (selectedCountries.indexOf(country.country) > -1) {
              this.selectedCountriesData.push(country);
            }
          });
        }

        localStorage.setItem("SelectedCountries", JSON.stringify(selectedCountries));
      }
    });
  }


  async addHomeCountry() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Home Country',
      buttons: this.homeCountriesSelection
    });
    await actionSheet.present();
  }


  async openHashTags() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Hash Tag',
      buttons: [
        {
          "text": "#Coronavirus",
          handler: () => {
            this.currentHashTag = "coronavirus";
            this.getTweets();
          },
        },
        {
          "text": "#CoronavirusOutbreak",
          handler: () => {
            this.currentHashTag = "CoronavirusOutbreak";
            this.getTweets();
          },
        },
        {
          "text": "#covid (COVID-19)",
          handler: () => {
            this.currentHashTag = "covid";
            this.getTweets();
          },
        },
        {
          "text": "#COVID2019",
          handler: () => {
            this.currentHashTag = "COVID2019";
            this.getTweets();
          },
        },
        {
          "text": "#COVID19",
          handler: () => {
            this.currentHashTag = "COVID19";
            this.getTweets();
          },
        },
        {
          "text": "Cancel",
          "role": "cancel"
        }
      ]
    });
    await actionSheet.present();
  }

  async getTweets(isLoadMoreTweets: boolean = false) {

    let loader = await this.loadingController.create({
      message: "Loading Tweets..."
    });

    loader.present();

    const reqObject = {
      hashTag: this.currentHashTag,
      nextResults: isLoadMoreTweets == true && this.nextResults ? this.nextResults : null
    };

    this.coronaDataService.getTwitterHashTagDetails(reqObject).subscribe((data) => {

      localStorage.setItem("SelectedHashtag", JSON.stringify(this.currentHashTag));
      this.nextResults = data.search_metadata.next_results;

      if (data.search_metadata.query.toLowerCase() !== this.currentHashTag.toLowerCase() || isLoadMoreTweets == false) {
        this.tweets = [];
        setTimeout(() => {
          this.content.scrollToTop(0);
          this.tweets = data.statuses;
        }, 10);
      }
      else {
        this.tweets.push(...data.statuses);
      }

      loader.dismiss();
    }, error => {
      loader.dismiss();
    });
  }

  tabChange(event: CustomEvent) {
    this.activeIndex = event.detail.index;

    if (this.activeIndex == 2) {
      let savedHashtag = localStorage.getItem("SelectedHashtag");

      if (savedHashtag && !this.currentHashTag) {
        this.currentHashTag = JSON.parse(localStorage.getItem("SelectedHashtag"));

        this.getTweets();
      }
    }
  }

  openTweet(tweet) {
    //  If tweet is retweeted
    if (tweet.retweeted_status && tweet.retweeted_status.entities) {

      if (tweet.retweeted_status.entities.urls && tweet.retweeted_status.entities.urls.length > 0) {
        var urls = tweet.retweeted_status.entities.urls;
        let url = urls[0].expanded_url;
        this.iab.create(url);
      }
      else if (tweet.retweeted_status.entities.media && tweet.retweeted_status.entities.media.length > 0) {
        var mediaUrls = tweet.retweeted_status.entities.media;
        let url = mediaUrls[0].expanded_url;
        this.iab.create(url);
      }
    }
    else {
      let url = `https://twitter.com/i/web/status/${tweet.id_str}`;
      this.iab.create(url);
    }
  }
}
