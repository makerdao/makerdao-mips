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

  mockLinks = {
    id: 'mock',
    name: 'Mock Link',
    children: [
      {
        id: 'mdLink',
        name: 'MD Link',
        href: 'https://github.com/makerdao/mips/blob/master/MIP0/mip0.md',
      },
      {
        id: 'noMdLink',
        name: 'NO MD Link',
        href: 'http://localhost:4200/mips/list?&search=UNI-v2',
      },
      {
        id: 'mockLi',
        name: 'Mock Link',
        children: [
          {
            id: 'mdLinkk',
            name: 'MD Link',
            href: 'https://github.com/makerdao/mips/blob/master/MIP0/mip0.md',
          },
          {
            id: 'noMdLink',
            name: 'NO MD Link',
            href: 'http://localhost:4200/mips/list?&search=UNI-v2',
          },
        ],
      },
    ],
  };

  ngOnInit(): void {
    this.menuService.getMenu().subscribe((data: any) => {
      this.menu = [...data.data, this.mockLinks];
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
}
