import { PagingResult } from './pagingresult.model';

export class Exception {
    public Area: string;
    public Category: string;
    public Data: string;
    public ExceptionType: string;
    public LogType: string;
    public Message: string;
    public ExceptionId: string;
    public Status: string;
    public Notes: string;
}

export class ExceptionDetails {
    public exceptionLogs: Array<Exception>;
    public pagingResult: PagingResult;
}
