export interface IAlarm {
    stoneCode: number;
    merchantName: string;
    trackerId: string;
    offset: number;
    diff: number;
    countByPeriod: number;
    runningCountByPeriod: number;
    processingEndOfPeriod: string;
    processingAlarmDate: string;
    alarmDate: string;
    alertGroup: string;
    processingTraceStartDate: string;
    processingTraceEndDate: string;
}

export interface ITotal {
    total: number;
}

export interface IFilter {
    skip: number;
    take: number;
    group: string;
    stoneCode: number;
    merchantName: string;
    order: string;
    initDate: string;
    endDate: string;
}
