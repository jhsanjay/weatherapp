import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { WeatherComponent } from './weather.component';
import { WeatherService } from './weather.service';


describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('weather component should create', () => {
    fixture = TestBed.createComponent(WeatherComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('preset cities count', () => {
    fixture = TestBed.createComponent(WeatherComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.presetCitiesList.length).toEqual(3);
  });

  it('It should console lat and lon for Singapore', () => {
    fixture = TestBed.createComponent(WeatherComponent);
    let city = 'Singapore'
    let weatherService = fixture.debugElement.injector.get(WeatherService);
    const apiResponse = [
      {
        country: "SG",
        lat: 1.2904753,
        local_names: { pl: "Singapur", wo: "Singapoor", na: "Tsingapoar", fr: "Singapour", gd: "Singeapòr", gu: "સિંગાપુર" },
        lon: 103.8520359,
        name: "Singapore"
      }
    ];
    let response;
    spyOn(weatherService, 'getLatLon').and.returnValue(new BehaviorSubject(apiResponse));
    weatherService.getLatLon(city).subscribe(res => {
      response = res;
      expect(response[0].name).toEqual(city);
      console.log('Singapore - Lat:'+response[0].lat + ', Lon:'+response[0].lon);
    });
  
  });
});

