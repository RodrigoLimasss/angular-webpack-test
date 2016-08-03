import 'core-js';
import 'reflect-metadata';
import 'zone.js/dist/zone';

import {enableProdMode} from "@angular/core";
import { bootstrap }    from '@angular/platform-browser-dynamic';
import {provideForms, disableDeprecatedForms} from '@angular/forms';
import { AppComponent } from './app.component';

console.info('app.environment:', app.environment);

if (app.environment === 'prod' || app.environment === 'pre') {
  enableProdMode();
}

bootstrap(AppComponent, [disableDeprecatedForms(), provideForms()]);
