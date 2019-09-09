import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'weather-forecast-directive',
  template: `
  <ion-item-sliding #item>
  <ion-item *ngIf="weather" (click)="hitWeather(weather)">
    <ion-thumbnail item-left>
      <img src="https://openweathermap.org/img/w/{{weather.weather[0].icon}}.png">
    </ion-thumbnail>
    <h1>{{weather.main.temp | temperature}}</h1>
    <h2>{{weather.name}}</h2>
    <p>
      Min: {{weather.main.temp_min | temperature}} Max: {{weather.main.temp_max | temperature}}
    </p>
    <ion-icon name="arrow-forward" item-right></ion-icon>
  </ion-item>
  <ion-item-options side="left">
      <button ion-button color="danger" (click)="removeItem(weather)">
      <ion-icon name="trash"></ion-icon>
      Löschen
      </button>
    </ion-item-options>
  </ion-item-sliding>
    `,
  host: {
    class: "weather-forecast-directive"
  }
})

export class WeatherForecast implements OnInit {
  nav: NavController;
  @Input() weather: Object;
  @Output() viewMore: EventEmitter<Object> = new EventEmitter();
  @Output() removeEvent: EventEmitter<Object> = new EventEmitter();

  constructor() {

  }

  ngOnInit() {

  }

  hitWeather() {
    this.viewMore.next(this.weather);
  }

  removeItem(weather) {
    this.removeEvent.emit(weather);
  }


}
