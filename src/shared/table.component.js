"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require("@angular/forms");
var ng2_bootstrap_1 = require('ng2-bootstrap/ng2-bootstrap');
var ng2_table_1 = require('ng2-table/ng2-table');
var alarm_service_1 = require('../services/alarm.service');
var TableComponent = (function () {
    function TableComponent(_alarmService) {
        this._alarmService = _alarmService;
        this.columns = [
            { title: 'Stone Code', name: 'stoneCode', sort: false },
            { title: 'Merchant Name', name: 'merchantName', sort: false },
            { title: 'Alert Group', name: 'alertGroup', sort: false },
            { title: 'Min Last Period', name: 'offset', sort: false },
            { title: 'Min Current Period', name: 'diff', sort: false },
            { title: 'Count Trx Last Period', name: 'countByPeriod', sort: false },
            { title: 'Count Trx Current Period', name: 'runningCountByPeriod', sort: false },
            { title: 'Alarm Date', name: 'alarmDate', sort: false }
        ];
        this.page = 1;
        this.skip = 0;
        this.itemsPerPage = 40;
        this.maxSize = 5;
        this.numPages = 1;
        this.length = 0;
        this.config = {
            paging: true,
            sorting: { columns: this.columns },
            filtering: {
                filterString: '',
                columnName: 'merchantName',
                stoneCode: '',
                initDate: '',
                endDate: '',
                groups: { High: false, Medium: false, Small: false, Micro: false }
            }
        };
        this.rows = [];
        this.data = [];
    }
    TableComponent.prototype.ngOnInit = function () {
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
    };
    TableComponent.prototype.viewModalLoading = function () {
        // $('#myModal').modal('show');
        // $('.modal-backdrop.in').css('opacity','0');
    };
    TableComponent.prototype.hideModalLoading = function () {
        //$('#myModal').modal('hide');
    };
    TableComponent.prototype.changePage = function (config, event) {
        this.viewModalLoading();
        var start = (event.page - 1) * this.itemsPerPage;
        this.skip = start;
        this.searchAlarms(config);
    };
    TableComponent.prototype.changeSort = function (data, config) {
        if (!config.sorting) {
            return data;
        }
        var columns = this.config.sorting.columns || [];
        var columnName = void 0;
        var sort = void 0;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }
        if (!columnName) {
            return data;
        }
        // simple sorting
        return data.sort(function (previous, current) {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            }
            else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    };
    TableComponent.prototype.changeFilter = function (data, config) {
        var _this = this;
        if (!config.filtering) {
            return data;
        }
        var filteredData = data.filter(function (item) {
            return item[config.filtering.columnName].toLocaleUpperCase().match(_this.config.filtering.filterString.toLocaleUpperCase());
        });
        return filteredData;
    };
    TableComponent.prototype.onChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.page, itemsPerPage: this.itemsPerPage }; }
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }
        var filteredData = this.changeFilter(this.data, this.config);
        var sortedData = this.changeSort(filteredData, this.config);
        this.hideModalLoading();
    };
    TableComponent.prototype.onClickSearch = function (config) {
        this.viewModalLoading();
        this.page = 1;
        this.skip = 0;
        this.searchAlarms(config);
    };
    TableComponent.prototype.searchAlarms = function (config) {
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
    };
    TableComponent.prototype.callServiceAlarm = function (filter) {
        var _this = this;
        this._alarmService.getAlarms(filter).subscribe(function (alarms) { _this.data = alarms; _this.rows = _this.data; _this.onChangeTable(_this.config); }, function (error) { return console.error(error); });
    };
    TableComponent.prototype.callServiceTotalAlarm = function (filter) {
        var _this = this;
        this._alarmService.getTotalAlarms(filter).subscribe(function (total) { _this.length = total.total; }, function (error) { return console.error(error); });
    };
    TableComponent.prototype.onClickClear = function () {
        location.reload();
    };
    TableComponent.prototype.factoryGroups = function (groups) {
        var urlGroups = "";
        if (groups.High)
            urlGroups += "High ";
        if (groups.Medium)
            urlGroups += "Medium ";
        if (groups.Small)
            urlGroups += "Small ";
        if (groups.Micro)
            urlGroups += "Micro ";
        return urlGroups.replace(/ /g, ",").slice(0, urlGroups.length - 1);
    };
    TableComponent = __decorate([
        core_1.Component({
            selector: 'ng2-table-alarm',
            templateUrl: './src/shared/table.component.html',
            styleUrls: ['./src/css/table.component.css'],
            directives: [ng2_table_1.NG_TABLE_DIRECTIVES, ng2_bootstrap_1.PAGINATION_DIRECTIVES, common_1.NgClass, common_1.NgIf, common_1.CORE_DIRECTIVES, forms_1.FORM_DIRECTIVES],
            providers: [alarm_service_1.AlarmService]
        }), 
        __metadata('design:paramtypes', [alarm_service_1.AlarmService])
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map