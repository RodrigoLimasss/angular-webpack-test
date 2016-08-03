import { Component, OnInit } from '@angular/core'
import { IAlarm } from '../models/alarm.model';
import { TableComponent } from '../shared/table.component';

@Component({
    selector: 'alarm-list',
    templateUrl: './src/alarms/alarm-list.component.html',
    styleUrls: ['./src/alarms/alarm-list.component.css'],
    directives: [TableComponent]
})

export class AlarmListComponent {
    errorMessage: string;
    alarms: IAlarm[];
}
