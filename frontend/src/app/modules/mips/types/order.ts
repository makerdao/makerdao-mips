export interface Order {
  field?: string;
  direction?: string;
}

export enum OrderField {
  Number = 'mip',
  Title = 'title',
  Summary = 'sentenceSummary',
  Status = 'status',
  MostUsed = 'MostUsed',
}

export enum OrderDirection {
  ASC = '',
  DESC = '-',
}

export enum OrderFieldName {
  Number = 'Number',
  Title = 'Title',
  Summary = 'Summary',
  Status = 'Status',
  MostUsed = 'MostUsed',
}
