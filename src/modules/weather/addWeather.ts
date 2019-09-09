import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


@Component({
  templateUrl: 'addWeather.html'
})
export class AddWeather {
  public data = {
    country: 'de'
  };

  constructor(public view: ViewController) { }

  dismiss(formData) {
    this.view.dismiss(formData);
  }

}
