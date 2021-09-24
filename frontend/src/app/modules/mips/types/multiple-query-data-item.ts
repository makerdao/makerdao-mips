import { IMip } from './mip';

export interface IMultipleQueryDataElement {
  queryName: string;
  query?: string;
  expanded?: boolean;
  moreToLoad?: boolean;
  limitAux?: number;
  mips?: IMip[];
  page?: number;
  total?: number;
  loading?: boolean;
}
