import { Component, Input, OnInit, Injector } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { ExternalModuleBase } from '../modules/module-base';
import { SoniaConfigService } from '../providers/sonia-config-service/index';
import { ConnectivityService } from '../providers/connectivity/index';
import { LoginRedirectService } from '../providers/authentication/login-redirect-service';
import { AppLauncherService } from '../providers/app-launcher/index';
import { OverviewPage } from '../pages/overview-page/index';
import _ from 'lodash';

declare var _paq: any;
/**
* will display a single overview button
* based on the module/page to render and its visual Config
**/

@Component({
  selector: 'sonia-overview-button',
  template: `
        <button ion-button text-wrap [ngStyle]="styles"
            id="{{layout.id}}"
            class="{{layout.type}}"
            (click)="onClick($event)">
                <ion-icon name="{{layout.icon}}"></ion-icon>{{layout.name}}
        </button>
    `,
  host: {
    class: 'sonia-overview-button'
  }
})

export class OverviewButton implements OnInit {
  /**
  * buttonConfig
  * with following properties:
  *
  * - stateKey        -   unique key for this state
  * - module OR page  -   @Page class to push to nav controller
  * - pageData        -   object to pass via nav params
  * - moduleData      -   object to pass via nav params
  * - buttonLayout          -   config props for visual styling recieved from individual config json files
  **/
  @Input() buttonConfig;
  @Input() defaultButtonColorKey: string;

  // extracted layout config, for convinience
  layout;
  styles;

  // set target component the parameters to pass to it
  navTarget;
  navParams;

  rootNav;

  constructor(
    app: App,
    public injector: Injector,
    public appLauncherService: AppLauncherService,
    public loginRedirectService: LoginRedirectService,
    public connectivityService: ConnectivityService,
    public nav: NavController
  ) {
    // we have to get the main app injector to resolve external modules
    this.rootNav = app.getRootNav();
  }


  // here we can access class members - class members are initialized at this point
  ngOnInit() {
    //
    // we split the layout property to easily set styles in the template via ngStyle
    //
    const layoutOnlyProps = ['_comment', 'type', 'id', 'icon', 'name'];

    const defaultLayoutConfig = {
      name: 'KEIN BUTTON NAME!',
      id: '',
      type: '',
      icon: ''
    };
    const defaultStylesConfig = {
      'color': '#ffffff',
      'background-color': (SoniaConfigService.COLOR_CONFIG[this.defaultButtonColorKey] || '#ff0000') // red indicates missing color!
    };
    this.layout = _.assign({}, defaultLayoutConfig, _.pick(this.buttonConfig.buttonLayout, layoutOnlyProps));
    this.styles = _.assign({}, defaultStylesConfig, _.omit(this.buttonConfig.buttonLayout, layoutOnlyProps));
    //
    // set the nav parameters
    //
    this.navParams = {}
    if (this.buttonConfig.moduleData) {
      this.navParams.moduleData = this.buttonConfig.moduleData
    }
    if (this.buttonConfig.pageData) {
      this.navParams.pageData = this.buttonConfig.pageData
    }
    if (this.buttonConfig.subStateTree) {
      this.navParams.stateTree = this.buttonConfig.subStateTree
    }

    //
    // set the link target to module or page component
    //
    if (this.buttonConfig.module && typeof this.buttonConfig.module == 'function') {
      this.navTarget = this.buttonConfig.module;

      // if the target is an external module, we set its instance to the navtarget
      if (this.navTarget.prototype instanceof ExternalModuleBase) {
        // resolve the external module via global injector
        // TODO find a better solution for this..
        let resolvedTarget = this.injector.get(this.navTarget);
        this.navTarget = resolvedTarget;
      }

    } else if (this.buttonConfig.page && typeof this.buttonConfig.page == 'function') {
      this.navTarget = this.buttonConfig.page;
    }
    //in case of new overview sub page
    else {
      this.navTarget = OverviewPage;
    }

  }

  onClick(_event) {
    // external modules are no @Page components but implement runExternal() and excute on run()
    // to run their logic without page transition, so we just call it on click
    if (this.navTarget instanceof ExternalModuleBase) {
      this.navTarget.run(new NavParams(this.navParams));
      // for normal modules we push the next page to the history stack
      // and also supply all the params that we got from state config
    } else {
      this.rootNav.push(this.navTarget, this.navParams).then(() => {
        _paq.push(['trackEvent', 'Menu-Navigation', this.navParams.pageData.pageTitle]);
        _paq.push(['trackPageView', this.navParams.pageData.pageTitle]);
      }).catch(() => { });
    }
  }

}
