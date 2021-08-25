import { Component, HostBinding, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuService } from 'src/app/services/menu/menu.service';
import Menu from '../../data-types/menu';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit {
  @Output() menuOpen: Subject<boolean> = new Subject<boolean>();
  openedIndexChild: number = -1;
  menu: Menu[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getMenu().subscribe((data: any) => {
      this.menu = data.data;
      let newMenu: Menu = {
        id: 'root',
        name: 'Root',
        href: '',
        children: this.menu,
      };

      this.dfs(newMenu);
    });
    this.menuService.openedIndexChild$.subscribe((data) => {
      this.openedIndexChild = data;
    });
  }

  onMenuToggle(ev) {
    this.menuOpen.next(ev);
  }

  onOpened(index: number) {
    this.openedIndexChild = index;
    this.menuService.setOpenedIndexChild(index);
  }

  @HostBinding('class.activeChild')
  get activeChild() {
    return this.openedIndexChild !== -1;
  }

  dfs(menu: Menu) {
    if (menu.href !== undefined && menu.custom_view_name) {
      menu.href += '&customviewname=' + menu.custom_view_name;
    }
    menu.children?.forEach((item) => {
      this.dfs(item);
    });
  }
}
