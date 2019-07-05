import { PagingResult } from "./pagingresult.model";

export class Comments {
  public id: string;
  public associatedSubjectId: string;
  public createdByUsername: string;
  public createdByUserid: string;
  public subjectType: string;
  public CreatedDate: string;
  public lastModifiedDate: string;
  public lastModifiedByUsername: string;
  public lastModifiedByUserId: string;
  public noteText: string;
}

export class CommentsModel {
  public records: Array<Comments>;
}

export class CommentsDetails {
  public records: Array<Comments>;
  public pagingResult: PagingResult;
}

