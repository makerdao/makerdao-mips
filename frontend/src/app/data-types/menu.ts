export default interface Menu {
  id: string;
  name: string;
  href?: string;
  img?: string;
  children?: Menu[];
  custom_view_name?: string;
  orderBy?: string;
  orderDirection?: string;
  queries?: IQuery[];
}

export class IQuery {
  id?: string;
  name?: string;
  query?: string;
}
