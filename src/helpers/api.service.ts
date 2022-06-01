import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseCallback } from './api-response-callback';
import { Observable, of, catchError, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient, private constants: Constants) { }

  hitGetApi(url: any, apiResponseCallback: ApiResponseCallback) {
    if (navigator.onLine) {
      this.httpClient.get(url).subscribe((res: any) => {
        if (res && res.hasOwnProperty('Error_code'))
          apiResponseCallback.onError(res.Error_code, res.Message);
        else
          apiResponseCallback.onSuccess(res);
      })
    } else {
      apiResponseCallback.onError(this.constants.noInternetConnectionError, this.constants.errorNoInternetConnectionAvailable);
    }
  }

  hitMultipleGetRequest(urls: string[], apiResponseCallback: ApiResponseCallback) {
    let observables: Array<Observable<Object>> = [];
    urls.forEach(element => {
      observables.push(this.httpClient.get(element).pipe(catchError(error => of(error))))
    });
    forkJoin(observables).subscribe(response => {
      apiResponseCallback.onSuccess(response);
    }, err =>{
      apiResponseCallback.onError(err.status, err.statusText);
    })
  }
}
