import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

import { enableProdMode } from '@angular/core'
//enable
//enableProdMode() ;

platformBrowserDynamic().bootstrapModule(AppModule);