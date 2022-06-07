import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
        MatSnackBarModule,
        ReactiveFormsModule]
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

  it('should get data from apiService for city',  () => {
    fixture = TestBed.createComponent(WeatherComponent);
    let city = 'Singapore'
    let weatherService = fixture.debugElement.injector.get(WeatherService);
    console.log(city);

    weatherService.getLatLon(city).subscribe(response => {
      expect(response.json()).toEqual({ success: true });
    });
  });
});
