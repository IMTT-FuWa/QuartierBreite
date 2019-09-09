import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'rxjs/Rx';
import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';
// enable it for Production mode
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
