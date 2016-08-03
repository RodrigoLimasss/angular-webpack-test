import {Component, OnInit} from '@angular/core';
import {CORE_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import {FORM_DIRECTIVES} from "@angular/forms";
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NG_TABLE_DIRECTIVES } from 'ng2-table/ng2-table';
import { AlarmService } from '../services/alarm.service';

@Component({
  selector: 'ng2-table-alarm',
  templateUrl: './src/shared/table.component.html',
  styleUrls: ['./src/css/table.component.css'],
  directives: [NG_TABLE_DIRECTIVES, PAGINATION_DIRECTIVES, NgClass, NgIf, CORE_DIRECTIVES, FORM_DIRECTIVES],
  providers: [AlarmService]
})

export class TableComponent implements OnInit {

  public columns: Array<any> = [
    { title: 'Stone Code', name: 'stoneCode', sort: false },
    { title: 'Merchant Name', name: 'merchantName', sort: false },
    { title: 'Alert Group', name: 'alertGroup', sort: false },
    { title: 'Min Last Period', name: 'offset', sort: false },
    { title: 'Min Current Period', name: 'diff', sort: false },
    { title: 'Count Trx Last Period', name: 'countByPeriod', sort: false },
    { title: 'Count Trx Current Period', name: 'runningCountByPeriod', sort: false },
    { title: 'Alarm Date', name: 'alarmDate', sort: false }
  ];

  public page: number = 1;
  public skip: number = 0;
  public itemsPerPage: number = 40;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: {
      filterString: '',
      columnName: 'merchantName',
      stoneCode: '',
      initDate: '', //moment().format("YYYY/MM/DD HH:mm:ss"),
      endDate: '', //moment().add(-1, 'days').format("YYYY/MM/DD HH:mm:ss"),
      groups: { High: false, Medium: false, Small: false, Micro: false }
    }
  };

  public rows: Array<any> = [];
  private data: Array<any> = [];

  public constructor(private _alarmService: AlarmService) {
  }

  public ngOnInit(): void {

    var filter = {
      stoneCode: 0,
      group: "",
      skip: this.skip,
      take: this.itemsPerPage,
      merchantName: '',
      order: "DESC",
      initDate: this.config.filtering.initDate,
      endDate: this.config.filtering.endDate
    };

    this.callServiceTotalAlarm(filter);
    this.callServiceAlarm(filter);

    this.viewModalLoading();
  }

  private viewModalLoading(): void {
    // $('#myModal').modal('show');
    // $('.modal-backdrop.in').css('opacity','0');
  }

  private hideModalLoading(): void {
    //$('#myModal').modal('hide');
  }

  public changePage(config: any, event: any): void {
    this.viewModalLoading();
    let start = (event.page - 1) * this.itemsPerPage;
    this.skip = start;
    this.searchAlarms(config);
  }

  public changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data: any, config: any): any {
    if (!config.filtering) {
      return data;
    }

    let filteredData: Array<any> = data.filter((item: any) =>
      item[config.filtering.columnName].toLocaleUpperCase().match(this.config.filtering.filterString.toLocaleUpperCase()));

    return filteredData;
  }

  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {

    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.hideModalLoading();
  }

  public onClickSearch(config: any): void {
    this.viewModalLoading();
    this.page = 1;
    this.skip = 0;
    this.searchAlarms(config);
  }

  private searchAlarms(config: any): void {
    var filter = config.filtering;

    var filterStruct = {
      stoneCode: parseInt(filter.stoneCode),
      merchantName: filter.filterString != "" ? filter.filterString.toLocaleUpperCase() : "",
      group: this.factoryGroups(filter.groups),
      skip: this.skip,
      take: this.itemsPerPage,
      order: "DESC",
      initDate: filter.initDate,
      endDate: filter.endDate
    };

    this.callServiceTotalAlarm(filterStruct);
    this.callServiceAlarm(filterStruct);
  }

  private callServiceAlarm(filter: any): void {
    this._alarmService.getAlarms(filter).subscribe(
      alarms => { this.data = alarms; this.rows = this.data; this.onChangeTable(this.config); },
      error => console.error(error))
  }

  private callServiceTotalAlarm(filter: any): void {
    this._alarmService.getTotalAlarms(filter).subscribe(
      total => { this.length = total.total; },
      error => console.error(error))
  }

  private onClickClear(): void {
    location.reload();
  }

  private factoryGroups(groups: any): string {

    var urlGroups = "";

    if (groups.High)
      urlGroups += "High "
    if (groups.Medium)
      urlGroups += "Medium "
    if (groups.Small)
      urlGroups += "Small "
    if (groups.Micro)
      urlGroups += "Micro "

    return urlGroups.replace(/ /g, ",").slice(0, urlGroups.length - 1)
  }
}
