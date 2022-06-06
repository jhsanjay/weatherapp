import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../helpers/api.service';
import { WeatherComponent } from './weather.component';
import { WeatherService } from './weather.service';


describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherComponent],
      imports: [HttpClientTestingModule, MatSnackBarModule]
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

  it('should get data from apiService', () => {
    fixture = TestBed.createComponent(WeatherComponent);
    let city = 'Basildon'
    let weatherService = fixture.debugElement.injector.get(WeatherService);
    weatherService.getLatLon(city).subscribe(response => {
      console.log(response);
      fixture.detectChanges()
      expect(response[0].name).toEqual('Mangalore');
    });
  });
});
