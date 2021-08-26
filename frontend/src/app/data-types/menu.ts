export default interface Menu {
  id: string;
  name: string;
  href: string;
  children: Menu[];
  custom_view_name?: string;
}
