import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../helpers/api.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  public _formGroup: FormGroup;
  constructor(public apiService: ApiService){}

  public getformGroup(): FormGroup {
    return this._formGroup;
  }

  public setformGroup(value: FormGroup) {
    this._formGroup = value;
  }
  getLatLon(city: string): Subject<any> {
    let subject: Subject<any> = new Subject();
    this.apiService.hitGetApi("http://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid=6ac8e8b3cab3af8a45d9779a27b040f9", {
      onSuccess(response) {
        subject.next(response);
      }, onError(errorCode, errorMsg) {

      }
    })
    return subject;
  }
  getWeatherPollution(lat: number, lon: number, unit:string): Subject<any> {
    let subject: Subject<any> = new Subject();
    let reqs = [
      "http://api.openweathermap.org/data/2.5/forecast?appid=6ac8e8b3cab3af8a45d9779a27b040f9&lon="+lon+"&lat="+lat+"&cnt=16&units="+unit,
      "http://api.openweathermap.org/data/2.5/air_pollution?appid=6ac8e8b3cab3af8a45d9779a27b040f9&lon="+lon+"&lat="+lat+"&cnt=16&units="+unit,
    ];
    this.apiService.hitMultipleGetRequest(reqs, {
      onSuccess(response) {
        subject.next(response);
      }, onError(errorCode, errorMsg) {

      }
    })
    return subject;
  }
}
