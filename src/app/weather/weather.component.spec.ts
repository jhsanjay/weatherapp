import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
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
    expect(app.presetCitiesList.length).toEqual(4);
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
      console.log('Singapore - Lat:' + response[0].lat + ', Lon:' + response[0].lon);
    });

  });
  it('should allow us to set a value from input field', fakeAsync(() => {
    setInputValue('#cityName', 'Bangalore');

    expect(component.cityName).toEqual('Bangalore');
  }));

  function setInputValue(selector: string, value: string) {
    fixture.detectChanges();
    tick();

    let input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    tick();
  }
});

describe('WeatherComponent', () => {
  let fixture: ComponentFixture<WeatherComponent>;
  let component: WeatherComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, MatSnackBarModule],
      declarations: [WeatherComponent],
      providers: []
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(WeatherComponent);
      component = fixture.componentInstance;
    });
  }));
  
  it('should call onClick of presetCities method', fakeAsync(() => {
    spyOn(component, 'presetCities');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();
    expect(component.presetCities).toHaveBeenCalled();

  }));

  it('should click clearCities button with waitForAsync', waitForAsync(() => {
    let clearCitiesSpy = spyOn(component, 'clearCities').and.callThrough();
    expect(clearCitiesSpy).not.toHaveBeenCalled();
  }));

  it('should click C button with value metric', waitForAsync(() => {
    spyOn(component, 'setUnit').withArgs('metric')
    expect(component.unit).toEqual('metric');
  }));

  it('should click F button with value imperial', fakeAsync(() => {
    spyOn(component, 'setUnit').withArgs('imperial').and.callFake(function(){

      let button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      tick();
      expect(component.unit).toEqual('imperial');
    })
  }));
});

