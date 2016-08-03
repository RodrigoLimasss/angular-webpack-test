import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http'
import 'rxjs/Rx'; // Load all features

import { IAlarm } from './models/alarm.model'
import { AlarmListComponent } from './alarms/alarm-list.component';

@Component({
    selector: 'app-component',
    templateUrl: './src/app.component.html',
    directives: [AlarmListComponent],
    providers: [HTTP_PROVIDERS]
})
export class AppComponent {
  pageTitle: string = "Merchant Alarms";
}
