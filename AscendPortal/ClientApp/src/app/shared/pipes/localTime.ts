import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

@Pipe({ name: 'localTime' })
export class LocalTimeTranslatePipe implements PipeTransform {
    transform(dateTime: string): string {
        var utcdate=moment.utc(dateTime).toDate();
        return moment(utcdate).local().format('MM/DD/YYYY HH:mm:ss');
    }
}
