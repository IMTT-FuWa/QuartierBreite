import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { createStateTree } from '../../utilities/create-state-tree';

@Injectable()
export class SoniaConfigService {
  private stateTreeUrl = "assets/JSON/config/stateConfig.json";
  private appSettingsUrl = "assets/JSON/config/appSettings.json";
  private overviewButtonConfigUrls = [
    "assets/JSON/buttons/camera.json",
    "assets/JSON/buttons/communication.json",
    "assets/JSON/buttons/entertainment.json",
    "assets/JSON/buttons/games.json",
    "assets/JSON/buttons/index.json",
    "assets/JSON/buttons/library.json",
    "assets/JSON/buttons/newspaper.json",
    "assets/JSON/buttons/noticeBoard.json",
    "assets/JSON/buttons/radio.json",
    "assets/JSON/buttons/service.json",
    "assets/JSON/buttons/timetable.json",
    "assets/JSON/buttons/videos.json",
    "assets/JSON/buttons/personal.json",
    "assets/JSON/buttons/mediatheken.json",
    "assets/JSON/buttons/audiobook.json"
  ];
  private colorConfigUrl = 'assets/JSON/config/colorConfig.json';

  public static STATE_TREE: any;
  public static APP_SETTINGS: any;
  public static COLOR_CONFIG: any;
  public static OVERVIEW_BUTTON_CONFIG: any[];

  constructor(public http: Http) {
    //injecting http
  }

  initConfig(): Promise<any> {
    return Promise.all(
      [this.getConfigFor(this.stateTreeUrl),
      this.getConfigFor(this.appSettingsUrl),
      this.getConfigFor(this.colorConfigUrl),
      this.getButtonConfigs()
      ]).then(x => {
        SoniaConfigService.APP_SETTINGS = x[1];
        SoniaConfigService.COLOR_CONFIG = x[2];
        createStateTree(x[0]).then(stateTree => {
          SoniaConfigService.STATE_TREE = stateTree;
          /**
          * TODO registering modules for news page
          **/
          Promise.resolve();
        });
      });
  }

  getButtonConfigs(): Promise<any> {
    var buttonConfigPromises = [];
    for (let buttonUrl of this.overviewButtonConfigUrls) {
      buttonConfigPromises.push(this.getConfigFor(buttonUrl));
    }
    return Promise.all(buttonConfigPromises).then(buttonsConfigs => {
      SoniaConfigService.OVERVIEW_BUTTON_CONFIG = buttonsConfigs;
    });
  }

  getConfigFor(url): Promise<any> {
    return this.http.get(url).toPromise().then(this.extractData);
  }

  private extractData(res: Response) {
    try {
      let json = res.json();
      return json;
    } catch (e) {
      throw new Error('LoadRemoteConfig: error parsing JSON: ' + res);
    }
  }

}
