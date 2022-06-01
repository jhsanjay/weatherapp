import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class Constants{
    public noInternetConnectionError = 101;
    public unauthorized = 401;
    public errorNotFound = 404;
    public errorDuplicate = 302;
    public errorNoInternetConnectionAvailable = "No Available Internet Connection";
}