export default interface Menu {
  id: string;
  name: string;
  href: string;
  children: Menu[];
}
