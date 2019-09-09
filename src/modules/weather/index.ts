import { Component } from '@angular/core';
import { NavParams, NavController, ModalController, AlertController } from 'ionic-angular';
import { ModuleBase } from '../module-base';
import { AddWeather } from "./addWeather";
import { WeatherService } from "../../providers/weather-service/weather-service";
import { ForecastPage } from "./forecast";
import { IDetailNavParams } from '../../shared-interfaces/data';
import { SoniaStorageService } from '../../providers/data-service/soniaStorageService';
import { ConnectivityService } from '../../providers/connectivity/index';
import { confirmAction } from '../../utilities/ConfirmActionAlert';


@Component({
  templateUrl: 'weather.html'
})
export class Weather extends ModuleBase {
  public weatherList = [];
  public localWeather: Object;
  public weathers: Array<Object>;

  constructor(
    public params: NavParams,
    public nav: NavController,
    public modalCtrl: ModalController,
    public weather: WeatherService,
    public soniaStorageService: SoniaStorageService,
    public conn: ConnectivityService,
    public alertController: AlertController) {

    super(params);
    this.getLocalWeather();
  }

  ionViewWillEnter() {
    this.getStoredWeather();
  }

  ionViewWillLeave() {
    this.storeWeather();
  }

  getStoredWeather() {
    this.soniaStorageService.getForType("weather").then((weather) => {
      weather.forEach(x => {
        this.getWeather(x.city, x.country);
      })
    },
      (error) => {
        console.log(error);
      });
  }

  storeWeather() {
    //store only cities and countries, since we need to always get the newest result for weather from service
    let cityWeatherList = this.weatherList.map(x => {
      var y = {};
      y['city'] = x.name;
      y['country'] = x.sys.country;
      return y;
    }
    );
    this.soniaStorageService.setForType("weather", cityWeatherList);
  }

  doAdd() {
    let addWeatherModal = this.modalCtrl.create(AddWeather);
    addWeatherModal.onDidDismiss((data) => {
      if (data) {
        this.getWeather(data.city, data.country);
      }
    })
    addWeatherModal.present();
  }

  removeItem(weather) {
    confirmAction(this.alertController,
      "Möchten Sie den Ort löschen?",
      "Sind sie sicher?",
      () => {
        for (var i = 0; i < this.weatherList.length; i++) {
          if (this.weatherList[i].name == weather.name) {
            this.weatherList.splice(i, 1);
          }
        }
      }
    );
  }

  getWeather(city: string, country: string) {
    //get weather data from api
    this.weather.city(city, country)
      .map(data => data.json())
      .subscribe(data => {
        //prevent having the same entry multiple times
        if (!this.weatherContains(this.weatherList, data)) {
          this.weatherList.push(data);
        }
      },
      err => console.log(err),
      () => console.log('getWeather erfolgreich!'))
  }

  getLocalWeather() {
    this.weather.local().subscribe(
      data => {
        if (!this.weatherContains(this.weatherList, data)) {
          this.weatherList.push(data);
        }
      }
    )
  }

  viewForecast(cityWeather) {
    // console.log('view forecast', cityWeather);
    let params: IDetailNavParams = {
      pageData: this.pageData,
      moduleData: this.moduleData,
      params: {
        data: {
          cityWeather: cityWeather
        }
      }
    };
    this.nav.push(ForecastPage, params);
  }

  isOnline(): boolean {
    return this.conn.isOnline;
  }

  weatherContains(array: any, element: any) {
    var found = false;
    for (var i = 0; i < array.length; i++) {
      if (array[i].name == element.name) {
        found = true;
        break;
      }
    }
    return found;
  }

}
