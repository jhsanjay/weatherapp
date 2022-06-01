import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WeatherService } from './weather.service';

export class WeatherDetails {
  name: string;
  weather: string;
  lat: string;
  lon: string;
  temp: string;
  pollution: Array<any>;
  forcast: Array<any>;
  icon: string;
  humidity: string;
  wind: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  tempCitiesList = ['Bengaluru', 'Basildon'];
  weatherDetails: Array<WeatherDetails> = [];
  unit: string = 'metric';
  formGroup: FormGroup;

  constructor(public weatherService: WeatherService, cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

}
