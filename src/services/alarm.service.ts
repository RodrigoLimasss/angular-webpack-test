import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Http, Response } from '@angular/http'
import { IAlarm, ITotal, IFilter } from '../models/alarm.model'

@Injectable()
export class AlarmService {

    private serviceUrl: string = "";
    private port: string = ":8888";
    private _serviceUrl: string = "";

    constructor(private _http: Http) {
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

    getAlarms(filter: IFilter): Observable<IAlarm[]> {
        return this._http.get(this.filterFactory("/filter", filter))
            .map((response: Response) => <IAlarm[]>response.json())
            .catch(this.handleError);
    }

    getTotalAlarms(filter: IFilter): Observable<ITotal> {
        return this._http.get(this.filterFactory("/filter/total", filter))
            .map((response: Response) => <ITotal>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    private filterFactory(path: string, filter: IFilter): string {
        //exe: /filter?stoneCode=265022191&group=High&skip=0&take=10&order=asc
        //exe: /filter/total?stoneCode=210829167&group=High

        var url: string = path + "?";

        if (filter.order != "")
            url += "order=" + filter.order;
        if (filter.stoneCode > 0)
            url += "&stoneCode=" + filter.stoneCode;
        if (filter.merchantName != "")
            url += "&merchantName=" + filter.merchantName;
        if (filter.group != "") {
            var groups = filter.group.split(',');
            for (let g in groups)
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

        return this._serviceUrl + url
    }
}
