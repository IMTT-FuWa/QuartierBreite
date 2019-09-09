import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SoniaNetzApp } from './app.component';
import { HttpModule, JsonpModule } from "@angular/http";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

//Shared components [Directives]
import { HeaderBar } from "../shared-components/header-bar";
import { CustomNavbar } from "../shared-components/custom-navbar-directive";
import { CustomTabs } from "../shared-components/custom-tabs-directive";
import { SubHeaderBar } from "../shared-components/sub-header-bar";
import { FooterBar } from "../shared-components/footer-bar";
import { NoEntriesWarning } from "../shared-components/no-entries-warning";
import { LAYOUT_DIRECTIVES } from "../shared-components/index";
import { OnlineLoadingIndicator } from "../shared-components/online-loading-indicator";
import { OnlineLoadingIndicatorLarge } from "../shared-components/online-loading-indicator-large";
import { ItemRow } from "../shared-components/item-row";
import { OverviewButton } from "../shared-components/overview-button";
import { OverviewButtons } from "../shared-components/overview-buttons";
import { Schedule } from "../shared-components/schedule";
import { SubHeaderBarChat } from "../shared-components/sub-header-bar-chat";
import { SubHeaderBarChatUser } from "../shared-components/sub-header-bar-chatUser"
import { WeatherForecast } from "../shared-components/weather-forecast-directive";
import { ToolbarBackgroundColor } from "../shared-components/toolbar-color-directive";

//Pages
import { ConfigLoaderPage } from '../pages/bootstrap-page/config-loader-page';
import { ServiceInjectionPage } from '../pages/bootstrap-page/service-injection-page';
import { LoginPage } from '../pages/login-page/index';
import { OverviewPage } from '../pages/overview-page/index';
import { ErrorPage } from '../pages/error-page/index';
import { NewsStreamSectionComponent } from "../pages/news-stream-page/news-stream-section-component";
import { InfoPage } from "../pages/info-page/index";
import { PassChangePage } from '../pages/pass-change/index';

//Chat
import { Chat } from "../modules/chat/chat";
import { ChatOverviewModule } from "../modules/chat/index";
import { ChatNewsStreamComponent } from "../modules/chat/newsStreamComponent";
import { CreateGroupModal } from "../modules/chat/createGroupModal";
import { AddGroupUserModal } from "../modules/chat/addGroupUserModal";
import { GroupUsers } from "../modules/chat/groupusers";

//Calendar
import { Calendar } from "../modules/calendar/index";
// import {CalendarEntry} from "../modules/calendar/calendarEntry";
import { CalendarEditEntry } from "../modules/calendar/editEntry";
import { CalendarEntryDetail } from "../modules/calendar/entryDetail";
import { CalendarNewsStreamComponent } from "../modules/calendar/newsStreamComponent";
import { CalendarImportModule } from "../modules/calendar/import";


//Blackboard
import {BlackboardList} from "../modules/blackboard/index";
import {BlackboardUserModal} from "../modules/blackboard/modal";
import {BlackboardCreateEntry} from "../modules/blackboard/createEntry";
import {BlackboardEntryDetail} from "../modules/blackboard/entryDetail";
import {BlackboardNewsStreamComponent} from "../modules/blackboard/newsStreamComponent";
import {Blackboard} from "../modules/blackboard/blackboard";
import {BoardUsers} from "../modules/blackboard/boardusers";
import {PopoverPage } from "../modules/blackboard/popoverPage";
import { BlackboardsOverview } from "../modules/blackboard/blackboards-overview";


//emergencyContacts
import { EmergencyContactDetail } from "../modules/emergencyContacts/contactDetail";
import { Contact } from "../modules/emergencyContacts/index";

//misc. modules
import { Weather } from "../modules/weather/index";
import { AddWeather } from "../modules/weather/addWeather";
import { ForecastPage } from "../modules/weather/forecast";
import { RssFeed } from "../modules/rss-feed/index";
import { ExampleModule } from "../modules/example-module/index";


//pipes
import { MomentDatePipe } from "../pipes/moment-date-pipe";
import { MaxWordCountPipe } from "../pipes/max-word-count-pipe";
import { TemperaturePipe } from "../pipes/temperature";
import { LinkifyPipe}  from '../pipes/linkify/linkify';
import { LineBreakPipe } from '../pipes/linebreak';

// providers for global injections
import { SoniaStorageService } from '../providers/data-service/soniaStorageService';
import { ConnectivityService } from '../providers/connectivity/index';
import { DataService } from '../providers/data-service/index';
import { LoginRemoteService } from '../providers/remote-services/login-remote-service';
import { BlackboardRemoteService } from "../providers/remote-services/blackboard-remote-service";
import { AddressRemoteService } from "../providers/remote-services/address-remote-service";
import { AppointmentRemoteService } from "../providers/remote-services/appointment-remote-service";
import { FirebaseDataService } from '../providers/data-service/firebase-data-service';
import { AuthenticationService } from '../providers/authentication/authentication-service';
import { LoginRedirectService } from '../providers/authentication/login-redirect-service';
import { RssService } from '../providers/rss/index';
import { SoniaConfigService } from '../providers/sonia-config-service/index';
import { InAppBrowserService } from '../providers/in-app-browser/index';
import { ExternalBrowser } from '../modules/externalBrowser/index';
import { AppLauncherService } from '../providers/app-launcher/index';
import { LauncherSkype } from '../modules/appLauncher/launcherSkype/index';
import { LauncherEmail } from '../modules/appLauncher/launcherEmail/index';
import { LauncherAddressbook } from '../modules/appLauncher/launcherAddressbook/index';
import { LauncherPlaner } from '../modules/appLauncher/launcherPlaner/index';
import { LauncherSolitaer } from '../modules/appLauncher/launcherSolitaer/index';
import { LauncherSudoko } from '../modules/appLauncher/launcherSudoko/index';
import { LauncherAnagramm } from '../modules/appLauncher/launcherAnagramm/index';
import { LauncherQuizduell } from '../modules/appLauncher/launcherQuizduell/index';
import { LauncherMahjong } from '../modules/appLauncher/launcherMahjong/index';
import { LauncherGedaechnistraining } from '../modules/appLauncher/launcherGedaechnistraining/index';
import { LauncherYoutube } from '../modules/appLauncher/launcherYoutube/index';
import { LauncherYounow } from '../modules/appLauncher/launcherYounow/index';
import { LauncherTakepicture } from '../modules/appLauncher/launcherTakepicture/index';
import { LauncherCewefotobook } from '../modules/appLauncher/launcherCewefotobook/index';
import { LauncherGalery } from '../modules/appLauncher/launcherGalery/index';
import { LauncherAldiFotobuch } from '../modules/appLauncher/launcherAldiFotobuch/index';
import { LauncherDbuecherei } from '../modules/appLauncher/launcherDbuecherei/index';
import { LauncherEbook } from '../modules/appLauncher/launcherEbook/index';
import { LauncherMusic } from '../modules/appLauncher/launcherMusic/index';
import { LauncherARD } from '../modules/appLauncher/launcherARD/index';
import { LauncherOeffi } from '../modules/appLauncher/launcherOeffi/index';
import { LauncherDBahn } from '../modules/appLauncher/launcherDBahn/index';
import { LauncherDfunk } from '../modules/appLauncher/launcherDfunk/index';
import { LauncherSWR } from '../modules/appLauncher/launcherSWR/index';
import { LauncherZDF } from '../modules/appLauncher/launcherZDF/index';
import { LauncherEigeneDateien } from '../modules/appLauncher/launcherEigeneDateien/index';
import { LauncherDeviceCalendar } from '../modules/appLauncher/launcherDeviceCalendar/index';
import { LauncherLibrivox } from '../modules/appLauncher/launcherLibrivox/index';
import { LauncherAudible } from '../modules/appLauncher/launcherAudible/index';
import { LaunchEmergencyEmail } from '../modules/emergencyEmail/index';
import { LaunchSocialStationEmail } from '../modules/socialStationEmail/index';
import { NewsStreamService } from '../providers/news-stream/index';
import { EmergencyEmailService } from '../providers/EmailComposer/index';
import { CalendarImportService } from "../providers/cal-import-export/calendarImportService";
import { SmartAudio } from '../providers/smart-audio';
import { IonicImageViewerModule } from 'ionic-img-viewer';


//Weather
import { WeatherService } from '../providers/weather-service/weather-service';

//Plugins
import { CallNumber } from '@ionic-native/call-number';
import { AppAvailability } from '@ionic-native/app-availability';
import { AppVersion } from '@ionic-native/app-version';
import { Camera } from '@ionic-native/camera';
import { EmailComposer } from '@ionic-native/email-composer';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';
import { NativeStorage } from '@ionic-native/native-storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { Calendar as cal } from '@ionic-native/calendar';
import { NativeAudio } from '@ionic-native/native-audio';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { HttpErrorHandler } from "../providers/remote-services/error-handler-service";
import { ResourceCalendar } from '../modules/resourceCalendar/index';
import { ResourceCalendarEditEntry } from '../modules/resourceCalendar/resourceCalendarEditEntry';
import { ResourceCalendarEntryDetail } from '../modules/resourceCalendar/resourceCalendarEntryDetail';
import { ImagesToFileSystemProvider } from '../providers/images-to-file-system/images-to-file-system';
import { EncryptionProvider } from '../providers/encryption/encryption';

/// <reference path="../node_modules/firebase/firebase.d.ts" />

//Get Firebase Configs
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: ""
};

@NgModule({
  declarations: [
    ServiceInjectionPage,
    ConfigLoaderPage,
    ExampleModule,
    RssFeed,
    EmergencyContactDetail,
    Contact,
    SoniaNetzApp,
    HeaderBar,
    SubHeaderBar,
    FooterBar,
    NoEntriesWarning,
    OnlineLoadingIndicator,
    OnlineLoadingIndicatorLarge,
    ItemRow,
    OverviewButton,
    OverviewButtons,
    Schedule,
    LoginPage,
    OverviewPage,
    ErrorPage,
    NewsStreamSectionComponent,
    InfoPage,
    PassChangePage,
    CustomNavbar,
    CustomTabs,
    LAYOUT_DIRECTIVES,
    SubHeaderBarChat,
    Chat,
    ChatNewsStreamComponent,
    SubHeaderBarChatUser,
    ChatOverviewModule,
    Calendar,
    CalendarEditEntry,
    CalendarEntryDetail,
    CalendarNewsStreamComponent,
    CalendarImportModule,
    ResourceCalendar,
    ResourceCalendarEditEntry,
    ResourceCalendarEntryDetail,
    Weather,
    AddWeather,
    ForecastPage,
    Blackboard,
    BlackboardList,
    BoardUsers,
    GroupUsers,
    BlackboardCreateEntry,
    BlackboardEntryDetail,
    BlackboardNewsStreamComponent,
    BlackboardUserModal,
    CreateGroupModal,
    AddGroupUserModal,
    MomentDatePipe,
    MaxWordCountPipe,
    TemperaturePipe,
    LinkifyPipe,
    LineBreakPipe,
    WeatherForecast,
    PopoverPage,
    ToolbarBackgroundColor,
    BlackboardsOverview
  ],
  imports: [
    IonicModule.forRoot(SoniaNetzApp, {
      tabsPlacement: 'bottom', // tabs for home page always on bottom
      platforms: {
        ios: {
          backButtonText: ''
        }
      }
    }),
    HttpModule,
    JsonpModule,
    BrowserModule,
    FormsModule,
    AngularFireDatabaseModule,
    IonicImageViewerModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ExampleModule,
    ServiceInjectionPage,
    ConfigLoaderPage,
    RssFeed,
    EmergencyContactDetail,
    Contact,
    SoniaNetzApp,
    LoginPage,
    OverviewPage,
    ErrorPage,
    InfoPage,
    PassChangePage,
    Chat,
    ChatNewsStreamComponent,
    ChatOverviewModule,
    Calendar,
    CalendarEditEntry,
    CalendarEntryDetail,
    CalendarNewsStreamComponent,
    CalendarImportModule,
    ResourceCalendar,
    ResourceCalendarEditEntry,
    ResourceCalendarEntryDetail,
    Weather,
    AddWeather,
    ForecastPage,
    Blackboard,
    BlackboardList,
    BoardUsers,
    GroupUsers,
    BlackboardCreateEntry,
    BlackboardEntryDetail,
    BlackboardNewsStreamComponent,
    BlackboardUserModal,
    CreateGroupModal,
    AddGroupUserModal,
    WeatherForecast,
    PopoverPage
  ],
  //Ordered by dependencies
  providers: [
    RssService,
    EmergencyEmailService,
    InAppBrowserService,
    ExternalBrowser,
    AppLauncherService,
    LauncherSkype,
    LauncherEmail,
    LauncherAddressbook,
    LauncherPlaner,
    LauncherSolitaer,
    LauncherSudoko,
    LauncherAnagramm,
    LauncherQuizduell,
    LauncherMahjong,
    LauncherGedaechnistraining,
    LauncherYoutube,
    LauncherYounow,
    LauncherTakepicture,
    LauncherCewefotobook,
    LauncherGalery,
    LauncherAldiFotobuch,
    LauncherDbuecherei,
    LauncherEbook,
    LauncherMusic,
    LauncherARD,
    LauncherOeffi,
    LauncherDBahn,
    LauncherDfunk,
    LauncherSWR,
    LauncherZDF,
    LauncherEigeneDateien,
    LauncherDeviceCalendar,
    LauncherLibrivox,
    LauncherAudible,
    LaunchEmergencyEmail,
    LaunchSocialStationEmail,
    ConnectivityService,
    CalendarImportService,
    BlackboardRemoteService,
    AddressRemoteService,
    AppointmentRemoteService,
    BlackboardsOverview,
    SoniaStorageService,
    DataService,
    LoginRemoteService,
    FirebaseDataService,
    AuthenticationService,
    LoginRedirectService,
    NewsStreamService,
    SoniaConfigService,
    CallNumber,
    AppAvailability,
    AppVersion,
    Camera,
    EmailComposer,
    Geolocation,
    InAppBrowser,
    NativeStorage,
    Network,
    SplashScreen,
    StatusBar,
    Keyboard,
    Device,
    cal,
    File,
    SmartAudio,
    NativeAudio,
    LaunchNavigator,
    HttpErrorHandler,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    WeatherService,
    ImagesToFileSystemProvider,
    EncryptionProvider
  ]
})
export class AppModule { }
