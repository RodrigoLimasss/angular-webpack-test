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
var Observable_1 = require('rxjs/Observable');
var http_1 = require('@angular/http');
var AlarmService = (function () {
    function AlarmService(_http) {
        this._http = _http;
        this.serviceUrl = "";
        this.port = ":8888";
        this._serviceUrl = "";
        switch (app.environment) {
            case "pre":
                this.serviceUrl = "10.152.20.212" + this.port;
                break;
            case "prod":
                this.serviceUrl = "172.19.110.50" + this.port;
                break;
            default:
                this.serviceUrl = "localhost" + this.port;
                break;
        }
        this._serviceUrl = "http://" + this.serviceUrl + "/api/v1/alarm";
    }
    AlarmService.prototype.getAlarms = function (filter) {
        return this._http.get(this.filterFactory("/filter", filter))
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    AlarmService.prototype.getTotalAlarms = function (filter) {
        return this._http.get(this.filterFactory("/filter/total", filter))
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    AlarmService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    AlarmService.prototype.filterFactory = function (path, filter) {
        //exe: /filter?stoneCode=265022191&group=High&skip=0&take=10&order=asc
        //exe: /filter/total?stoneCode=210829167&group=High
        var url = path + "?";
        if (filter.order != "")
            url += "order=" + filter.order;
        if (filter.stoneCode > 0)
            url += "&stoneCode=" + filter.stoneCode;
        if (filter.merchantName != "")
            url += "&merchantName=" + filter.merchantName;
        if (filter.group != "") {
            var groups = filter.group.split(',');
            for (var g in groups)
                url += "&group=" + groups[g];
        }
        if (filter.skip > 0)
            url += "&skip=" + filter.skip;
        if (filter.take > 0)
            url += "&take=" + filter.take;
        if (filter.initDate != "")
            url += "&initDate=" + filter.initDate;
        if (filter.endDate != "")
            url += "&endDate=" + filter.endDate;
        return this._serviceUrl + url;
    };
    AlarmService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AlarmService);
    return AlarmService;
}());
exports.AlarmService = AlarmService;
//# sourceMappingURL=alarm.service.js.map