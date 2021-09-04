import { OrderField } from './order';

export default interface QueryParams {
  status?: string[];
  search?: string;
  contributor?: string;
  author?: string;
  mipsetMode?: boolean;
  customViewName?: string;
  orderBy?: string;
  orderDirection?: string;
}
