export interface Order {
  field?: OrderField;
  direction?: OrderDirection;
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
