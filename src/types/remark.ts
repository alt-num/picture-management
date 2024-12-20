export type RemarkType = 'suggestion' | 'complaint' | 'request';

export interface Remark {
  id: string;
  profileId: string;
  type: RemarkType;
  date: string;
  madeBy: string;
  title: string;
  body: string;
}

export interface NewRemark {
  profileId: string;
  type: RemarkType;
  madeBy: string;
  title: string;
  body: string;
}
