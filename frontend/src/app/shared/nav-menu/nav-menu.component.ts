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
        name: 'MIP 0',
        href:
          'https://github.com/makerdao/mips/blob/master/MIP0/mip0.md',
      },
      {
        id: 'noMdLink',
        name: 'Github MD Link',
        href: 'https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md',
      },
      {
        id: 'mockLi',
        name: 'Readme in Example',
        href:
          'https://github.com/makerdao/mips/blob/master/README.md',
      },
      {
        id: 'local',
        name: 'Local',
        href:
          'http://localhost:4200/mips/list?status=RFC&search=',
      },

      
    ],
  };



  ngOnInit(): void {
    this.menuService.getMenu().subscribe((data: any) => {
      this.menu = [...data.data,this.mockLinks];
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
