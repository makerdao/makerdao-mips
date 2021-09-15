export default interface Menu {
  id: string;
  name: string;
  href?: string;
  img?: string;
  children?: Menu[];
  custom_view_name?: string;
  orderBy?: string;
  orderDirection?: string;
}
