export interface Order {
  field?: OrderField;
  direction?: OrderDirection;
}

export enum OrderField {
  pos = 'mip',
  title = 'title',
  summary = 'sentenceSummary',
  status = 'status',
  mostUsed = 'MostUsed',
  number = 'mip'
}

export enum OrderDirection {
  ASC = '',
  DESC = '-',
}
