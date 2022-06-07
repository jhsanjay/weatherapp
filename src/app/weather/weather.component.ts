import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Constants } from '../../helpers/constants';
import { HelperService } from '../../helpers/helper.service';
import { WeatherDetails } from '../../helpers/weather-details.model';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {

  formGroup: FormGroup;
  unit: string = 'metric';
  today;
  presetCitiesList = ['Mangalore', 'Singapore', 'Bangalore'];
  weatherDetails: Array<WeatherDetails> = [];
  savedCities: string[] = [];
  tempCities: string[] = [];
  citiesList = [];
  changeUnit: boolean = false;
  submitClicked: boolean = false;
  subscription: Subscription;
  subscription1: Subscription;
  preset: boolean;

  constructor(public weatherService: WeatherService,
    public cd: ChangeDetectorRef,
    private helperService: HelperService,
    public constant: Constants
  ) { }

  ngOnInit(): void {
    init(this);
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed)
      this.subscription.unsubscribe();
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
  }

  // method to change unit
  setUnit(unit: string) {
    if (this.unit !== unit) {
      this.unit = unit;
      this.changeUnit = true;
      init(this);
    }
  }

  // remove city from list
  removeCity(index) {
    this.weatherDetails.splice(index, 1);
  }

  // event called when add city button clicked
  addCity() {
    this.submitClicked = true;
    let cityName = this.formGroup.get('cityName').value.trim();
    if (this.formGroup.valid && cityName.length > 0) {
      if (!this.weatherDetails.map(e => e.name.toLowerCase()).includes(cityName.toLowerCase())) {
        let temp = new WeatherDetails();
        this.subscription = this.weatherService.getLatLon(cityName).subscribe(response => {
          let geoDetails = response[0];
          if (response[0]) {
            temp.name = geoDetails.name;
            this.subscription1 = this.weatherService.getWeatherPollution(geoDetails.lat, geoDetails.lon, this.unit).subscribe(resp => {
              // additional name check due to difference in city name returned by api
              if (!this.weatherDetails.map(e => e.name.toLowerCase()).includes(temp.name.toLowerCase())) {
                this.weatherDetails.push(addToTemp(temp, resp, this));

                this.tempCities.push(cityName)
                this.cd.markForCheck();
              }
              else {
                this.helperService.openSnackBar(cityName.charAt(0).toUpperCase() + cityName.substring(1, cityName.length) + ' already added to list', "Error")
              }
            });
            this.formGroup.patchValue({
              'cityName': ''
            })
            this.submitClicked = false;
          } else {
            this.helperService.openSnackBar('City not found', "Error")
          }
        });
      } else {
        this.helperService.openSnackBar(cityName.charAt(0).toUpperCase() + cityName.substring(1, cityName.length) + ' already added to list', "Error")
      }

    }

  }

  // save city
  saveCity(cityName: string) {
    if (!this.savedCities.map(e => e.toLowerCase())?.includes(cityName.toLowerCase())) {
      this.savedCities.push(cityName);
    } else {
      let a = this.savedCities.find(e => e.toLowerCase() === cityName.toLowerCase());
      this.savedCities.splice(this.savedCities.map(e => e.toLowerCase()).indexOf(a.toLowerCase()), 1);
    }
    localStorage.setItem('savedCities', this.savedCities.join())
    this.cd.markForCheck();
  }

  // check if the city is favourite saved
  isSavedCity(cityName) {
    if (this.savedCities?.find(e => e.toLowerCase() === cityName.toLowerCase())) {
      return true;
    }
    return false;
  }

  refreshBoard() {
    this.citiesList = [];
    this.today = moment().format('MMMM Do YYYY, h:mm:ss a');
    init(this);
  }

  // load preset cities
  presetCities() {
    this.today = moment().format('MMMM Do YYYY, h:mm:ss a');
    this.citiesList = [];
    this.tempCities = [];
    this.preset = true;
    init(this);
  }
  // clear all presets, favourites
  clearCities() {
    this.citiesList = [];
    this.tempCities = [];
    this.weatherDetails = [];
    localStorage.setItem("savedCities", "");
    this.cd.markForCheck();
  }
}

function init(context: WeatherComponent) {
  context.today = moment().format('MMMM Do YYYY, h:mm:ss a');
  addFormValidation(context);
  context.weatherService.setformGroup(context.formGroup);
  context.weatherDetails = [];
  if (!context.changeUnit) {
    let savedCities = localStorage.getItem('savedCities');
    if (savedCities) {
      if (!context.preset) {
        context.savedCities = savedCities.split(',').map(e => e.trim());
        context.savedCities.forEach(element => {
          if (!context.citiesList.map(e => e.toLowerCase()).includes(element.toLowerCase())) {
            context.citiesList.push(element);
          }
        });

      } else {
        context.citiesList.push(...context.presetCitiesList);
      }
    }
    if (context.tempCities) {
      let listT = context.tempCities.filter(e => !context.citiesList.map(e => e.toLowerCase()).includes(e.toLowerCase()))
      context.citiesList.push(...listT)
    }
  }
  context.changeUnit = false;
  context.citiesList.forEach(element => {
    let temp = new WeatherDetails();
    context.subscription = context.weatherService.getLatLon(element).subscribe(response => {
      if (response[0]) {
        let geoDetails = response[0];
        temp.name = geoDetails.name;
        context.subscription1 = context.weatherService.getWeatherPollution(geoDetails.lat, geoDetails.lon, context.unit).subscribe(resp => {
          if (resp)
            context.weatherDetails.push(addToTemp(temp, resp, context));
        });
      }
    });
  });
}

// formGroup
function addFormValidation(context: WeatherComponent) {
  context.formGroup = new FormGroup({
    cityName: new FormControl('', Validators.required)
  })
}

// adding details to temp obj to add to list 
function addToTemp(temp, resp: Array<any>, context: WeatherComponent) {
  temp.weather = resp[0]['list'][0].weather[0].description;
  temp.lat = resp[0]['city']['coord']['lat'];
  temp.lon = resp[0]['city']['coord']['lon'];
  temp.temp = resp[0]['list'][0].main.temp;
  temp.forcast = resp[0]['list'];
  temp.icon = resp[0]['list'][0]['weather'][0]['icon'];
  temp.humidity = resp[0]['list'][0]['main']['humidity'];
  temp.wind = resp[0]['list'][0]['wind']['speed'];
  temp.description = resp[0]['list'][0]['weather'][0]['description'];
  temp.pollution = resp[1]['list'][0]['components']
  return temp;
}