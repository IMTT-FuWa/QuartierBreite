// import every known module
import { LauncherSkype } from './appLauncher/launcherSkype/index';
import { LauncherAddressbook } from './appLauncher/launcherAddressbook/index';
import { LauncherAldiFotobuch } from './appLauncher/launcherAldiFotobuch/index';
import { LauncherAnagramm } from './appLauncher/launcherAnagramm/index';
import { LauncherOeffi } from './appLauncher/launcherOeffi/index';
import { LauncherDBahn } from './appLauncher/launcherDBahn/index';
import { LauncherBoccia } from './appLauncher/launcherBoccia/index';
import { LauncherDbuecherei } from './appLauncher/launcherDbuecherei/index';
import { LauncherDfunk } from './appLauncher/launcherDfunk/index';
import { LauncherEbook } from './appLauncher/launcherEbook/index';
import { LauncherEigeneDateien } from './appLauncher/launcherEigeneDateien/index';
import { LauncherDeviceCalendar } from './appLauncher/launcherDeviceCalendar/index';
import { LauncherEmail } from './appLauncher/launcherEmail/index';
import { LauncherGalery } from './appLauncher/launcherGalery/index';
import { LauncherGedaechnistraining } from './appLauncher/launcherGedaechnistraining/index';
import { LauncherHangouts } from './appLauncher/launcherHangouts/index';
import { LauncherMahjong } from './appLauncher/launcherMahjong/index';
import { LauncherPlaner } from './appLauncher/launcherPlaner/index';
import { LauncherQuizduell } from './appLauncher/launcherQuizduell/index';
import { LauncherSolitaer } from './appLauncher/launcherSolitaer/index';
import { LauncherSudoko } from './appLauncher/launcherSudoko/index';
import { LauncherSWR } from './appLauncher/launcherSWR/index';
import { LauncherZDF } from './appLauncher/launcherZDF/index';
import { LauncherTakepicture } from './appLauncher/launcherTakepicture/index';
import { LauncherCewefotobook } from './appLauncher/launcherCewefotobook/index';
import { LauncherYounow } from './appLauncher/launcherYounow/index';
import { LauncherYoutube } from './appLauncher/launcherYoutube/index';
import { LauncherMusic } from './appLauncher/launcherMusic/index';
import { LauncherARD } from './appLauncher/launcherARD/index';
import { LauncherLibrivox } from './appLauncher/launcherLibrivox/index';
import { LauncherAudible } from './appLauncher/launcherAudible/index';
import { ExternalBrowser } from './externalBrowser/index';
import { Calendar } from './calendar/index';
import { Weather } from './weather/index';
import { BlackboardList } from './blackboard/index';
import { Contact } from './emergencyContacts/index';
import { LaunchSkypeCall } from './appLauncher/skypeCall/index';
import { RssFeed } from './rss-feed/index';
import { ExampleModule } from './example-module/index';
import { ExampleExternalModule } from './example-external-module/index';
import { LaunchEmergencyEmail } from './emergencyEmail/index';
import { LaunchSocialStationEmail } from './socialStationEmail/index';
import { ChatOverviewModule } from './chat/index';
import { ResourceCalendar } from './resourceCalendar/index';

// register the modules in the 'registry'
// we need this dictionary to check if if modules required by config files
// actually exist
const modules = {
  LauncherSkype,
  LauncherAddressbook,
  LauncherAldiFotobuch,
  LauncherAnagramm,
  LauncherOeffi,
  LauncherDBahn,
  LauncherBoccia,
  LauncherDbuecherei,
  LauncherDfunk,
  LauncherEbook,
  LauncherEigeneDateien,
  LauncherDeviceCalendar,
  LauncherEmail,
  LauncherGalery,
  LauncherGedaechnistraining,
  LauncherHangouts,
  LauncherMahjong,
  LauncherPlaner,
  LauncherQuizduell,
  LauncherSolitaer,
  LauncherSudoko,
  LauncherSWR,
  LauncherZDF,
  LauncherTakepicture,
  LauncherCewefotobook,
  LauncherYounow,
  LauncherYoutube,
  ExternalBrowser,
  Calendar,
  ResourceCalendar,
  Weather,
  BlackboardList,
  Contact,
  LaunchSkypeCall,
  LauncherMusic,
  LauncherARD,
  LauncherAudible,
  LauncherLibrivox,
  RssFeed,
  ExampleModule,
  LaunchEmergencyEmail,
  LaunchSocialStationEmail,
  ExampleExternalModule,
  ChatOverviewModule
};

/**
* the getter method to recieve modules
*
* only this method should be used to import modules in other components of pages
**/
export function getModule(moduleName) {
  if (moduleExists(moduleName)) {
    return modules[moduleName];
  } else {
    // TODO tell app user that something went wrong!
    throw new Error(`Module loading error: Module ${moduleName} was requested but was not found!`);
  }
}

function moduleExists(moduleName) {
  return modules.hasOwnProperty(moduleName);
}
