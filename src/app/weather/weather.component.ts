import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Constants } from '../../helpers/constants';
import { ValidationService } from '../../helpers/validation.service';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {

  formGroup: FormGroup;
  weatherResponse: any;
  unit: string = 'metric';
  today = moment().format('MMMM Do YYYY, h:mm:ss a');
  geoDetails: any;
  tempCitiesList = ['Mangalore', 'Basildon'];
  weatherDetails: { name: string, weather: string, lat: string, lon: string, temp: string, pollution: Array<any>, forcast: Array<any>, icon: string, humidity: string, wind: string }[] = [];
  savedCities: string[] = [];
  tempCities: string[] = [];
  durationInSeconds = 5;
  citiesList = [];
  forcastDetails = [];
  weatherIcon: any;
  weatherDescription: any;
  option: any;
  changeUnit: boolean = false;
  submitClicked: boolean = false;


  constructor(public weatherService: WeatherService,
    public injector: Injector,
    public cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    public validationService: ValidationService,
    public constant: Constants

  ) { }

  ngOnInit(): void {
    init(this);
  }

  setUnit(unit: string) {
    if (this.unit !== unit) {
      this.unit = unit;
      this.changeUnit = true;
      init(this);
    }
  }

  // event called when add city button clicked
  addCity() {
    if (this.formGroup.valid) {
      this.submitClicked = true;
      let cityName = this.formGroup.get('cityName').value;
      if (!this.weatherDetails.map(e => e.name.toLowerCase()).includes(cityName.toLowerCase())) {
        let temp = { name: '', weather: '', lat: '', lon: '', temp: '', pollution: [], forcast: [], icon: '', humidity: '', wind: '' };
        this.weatherService.getLatLon(cityName).subscribe(response => {
          this.geoDetails = response[0];
          if (response[0]) {
            temp.name = this.geoDetails.name;
            this.weatherService.getWeatherPollution(this.geoDetails.lat, this.geoDetails.lon, this.unit).subscribe(resp => {
              this.weatherDetails.push(addToTemp(temp, resp, this));
              this.tempCities.push(cityName)
              this.cd.markForCheck();
            });
          } else {
            this.openSnackBar('City not found')
          }
        });
      } else {
        this.openSnackBar(cityName.charAt(0).toUpperCase() + cityName.substring(1, cityName.length) + ' already added to list')
      }
      this.formGroup.patchValue({
        'cityName': ''
      })
    }

  }

  openSnackBar(messageString: string) {
    this._snackBar.open(messageString, "Error", {
      duration: this.durationInSeconds * 1000,
    });
  }

  // save city
  saveCity(cityName: string) {
    if (!this.savedCities.map(e => e.toLowerCase())?.includes(cityName.toLowerCase())) {
      this.savedCities.push(cityName);
    } else {
      let a = this.savedCities.find(e => e.toLowerCase() === cityName.toLowerCase());
      this.savedCities.splice(this.savedCities.map(e => e.toLowerCase()).indexOf(a.toLowerCase()));
    }
    localStorage.setItem('savedCities', this.savedCities.join())

    this.cd.markForCheck();
  }

  isSavedCity(cityName) {
    if (this.savedCities?.find(e => e.toLowerCase() === cityName.toLowerCase())) {
      return true;
    }
    return false;
  }

  refreshBoard() {
    this.weatherDetails = [];
    this.citiesList = [];
    this.today = moment().format('MMMM Do YYYY, h:mm:ss a');
    init(this);
  }

  presetCities() {
    this.citiesList = [];
    init(this);
  }

  clearCities() {
    this.citiesList = [];
    this.tempCities = [];
    this.weatherDetails = [];
    localStorage.setItem("savedCities", "");
    this.cd.markForCheck();
  }
}

function init(context: WeatherComponent) {
  addFormValidation(context);
  context.weatherService.setformGroup(context.formGroup);
  context.weatherDetails = [];
  if (!context.changeUnit) {
   
    let savedCities = localStorage.getItem('savedCities');

    if (savedCities) {
      context.savedCities = savedCities.split(',').map(e => e.trim());
      context.savedCities.forEach(element => {
        if (!context.citiesList.map(e => e.toLowerCase()).includes(element.toLowerCase())) {
          context.citiesList.push(element);
        }
      });

      if (context.tempCities) {
        let listT = context.tempCities.filter(e => !context.citiesList.map(e => e.toLowerCase()).includes(e.toLowerCase()))
        context.citiesList.push(...listT)
      }
    } else {
      context.citiesList.push(...context.tempCitiesList);
    }
  }
  context.changeUnit = false;
  context.citiesList.forEach(element => {
    let temp = { name: '', weather: '', lat: '', lon: '', temp: '', pollution: [], forcast: [], icon: '', humidity: '', wind: '' };
    context.weatherService.getLatLon(element).subscribe(response => {
      context.geoDetails = response[0];
      temp.name = context.geoDetails.name;
      context.weatherService.getWeatherPollution(context.geoDetails.lat, context.geoDetails.lon, context.unit).subscribe(resp => {
        console.log(resp);

        context.weatherDetails.push(addToTemp(temp, resp, context));
      });
    });
  });
}

function addFormValidation(context: WeatherComponent) {
  context.formGroup = new FormGroup({
    cityName: new FormControl('', context.validationService.addRequiredValidation())
  })
}

function addToTemp(temp, resp: Array<any>, context: WeatherComponent) {
  console.log(resp);

  temp.weather = resp[0]['list'][0].weather[0].description;
  temp.lat = resp[0]['city']['coord']['lat'];
  temp.lon = resp[0]['city']['coord']['lon'];
  temp.name = resp[0]['city']['name']
  temp.temp = resp[0]['list'][0].main.temp;
  temp.forcast = resp[0]['list'];
  temp.icon = resp[0]['list'][0]['weather'][0]['icon'];
  temp.humidity = resp[0]['list'][0]['main']['humidity'];
  temp.wind = resp[0]['list'][0]['wind']['speed'];
  temp.description = resp[0]['list'][0]['weather'][0]['description'];
  temp.pollution = resp[1]['list'][0]['components']
  return temp;
}