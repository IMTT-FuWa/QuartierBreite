import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { WeatherService } from "../../providers/weather-service/weather-service";

@Component({
  templateUrl: 'forecast.html'
})
export class ForecastPage extends ModuleBase {
  public cityWeather;
  public forecast = [];
  public id;

  constructor(
    public navParams: NavParams,
    public weather: WeatherService) {
    super(navParams);
    this.cityWeather = this.navParams.get('params').data.cityWeather;
    this.getForecast(this.cityWeather.id);
  }
  getForecast(cityId) {
    this.weather.forecast(cityId, 7)
      .map(data => data.json())
      .subscribe(data => {
        this.forecast = this.mapForecast(data.list);
      },
      err => console.log(err),
      () => console.log('forecast erfolgreich!'))
  }

  mapForecast(forecast): any {
    forecast.forEach(x => {
      //convert millis from api to date
      x["day"] = new Date(x.dt * 1000).toISOString();
    })
    return forecast;
  }

}
