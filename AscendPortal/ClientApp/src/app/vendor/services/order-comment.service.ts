import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CommentsDetails } from '../../shared/models/order-comment-models';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class OrderCommentService {
  public commentsURL: string;
  public commentsIdURL: string;
  public commentsQueryAPI: string;
  public commentsCommandAPI: string;
  constructor(private http: HttpClient, private configService: ConfigService) {
    if (this.configService.isReady) {
      console.log('config service ready');
      this.commentsQueryAPI = this.configService.serverSettings.commentsManagementQueryAPI;
      this.commentsCommandAPI = this.configService.serverSettings.commentsManagementCommandAPI;
    } else {
      console.log('config service not ready');
      this.configService.settingsLoaded$.subscribe(x => {
        this.commentsQueryAPI = this.configService.serverSettings.commentsManagementQueryAPI;
        this.commentsCommandAPI = this.configService.serverSettings.commentsManagementCommandAPI;
      });
    }
  }

  getCommentsBySubjectId(pageNumber: number, pageSize: number, subjectId: string): Observable<CommentsDetails> {
    pageNumber = pageNumber;
    pageSize = pageSize;
    const url = `${this.commentsQueryAPI}/notes/subjects/${subjectId}?pageNumber=${pageNumber}&pagesize=${pageSize}`;
    return this.http.get<CommentsDetails>(url);
  }

  addComments(noteText: string, createdByUsername: string, createdByUserId: string, subjectType: string, associatedSubjectId: string) {
    const url = `${this.commentsCommandAPI}/notes`;
    const data = {
      'noteText': noteText,
      'createdByUsername': 'o2cPortal',
      'createdByUserId': 'o2cPortal',
      'subjectType': subjectType,
      'associatedSubjectId': associatedSubjectId
    };
    return this.http.post(url, data, { observe: 'response' });
  }

  public postComments(orderId: string, note: string, orderType: string) {

    const payload = {
      noteText: note,
      createdByUsername: "O2CPORTAL",
      createdByUserId: "O2CPORTAL",
      subjectType: orderType,
      associatedSubjectId: orderId
    }
    const url = `${this.commentsCommandAPI}/notes`;
    return this.http.post<any>(url, payload, { observe: 'response' });
  }
}


