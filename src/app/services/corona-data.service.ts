import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CoronaDataService {

  api: string = environment.herokuApi;

  constructor(
    private httpService: HttpService
  ) {
    this.api = this.api + "coronaapi/"
  }

  getCurrentCases(): Observable<any> {
    const url = this.api + "all";
    return this.httpService.get(url);
  }

  getCountries(): Observable<any> {
    let url = this.api + "countries";
    return this.httpService.get(url);
  }

  getDataOfCountry(countryName: string): Observable<any> {
    const url = this.api + "countries/" + countryName;
    return this.httpService.get(url);
  }

  getTwitterHashTagDetails(data: object): Observable<any> {
    const url = this.api + "GetTwitterHashTagDetails/";
    return this.httpService.post(url, data);
  }
}
