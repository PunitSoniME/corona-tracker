import { Component, OnInit } from '@angular/core';
import { CoronaDataService } from '../services/corona-data.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AllCountryData } from '../home/home.classes';

@Component({
  selector: 'app-country',
  templateUrl: './country.page.html',
  styleUrls: ['./country.page.scss'],
})
export class CountryPage implements OnInit {

  countryName: string;
  countryData: AllCountryData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private coronaDataService: CoronaDataService
  ) {

  }

  async ngOnInit() {
    this.countryName = this.activatedRoute.snapshot.paramMap.get("countryName");

    let loader = await this.loadingController.create({
      message: "Please wait..."
    });
    loader.present().then(() => {
      this.coronaDataService.getDataOfCountry(this.countryName).subscribe(response => {
        this.countryData = response;

        loader.dismiss();
      }, error => {
        loader.dismiss();
      });
    });
  }

}
