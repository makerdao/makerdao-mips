import { Component, HostBinding, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { FeedbackService } from 'src/app/modules/mips/services/feedback.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UrlService } from 'src/app/services/url/url.service';
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
  feedBackLinkMenu: Menu = {
    id: 'feedbacklink',
    name: '',
    img: '../../assets/images/feedback_dialog_icon_menu.svg',
    href: '',
    children: [],
  };

  constructor(
    private menuService: MenuService,
    private urlService: UrlService,
    private feedbackService: FeedbackService
  ) {}

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

    this.menuService.clicked$.subscribe((data: Menu) => {
      if (data) {
        if (data.href) {
          this.urlService.goToUrl(data.href);
        } else {
          if (data.id === this.feedBackLinkMenu.id) {
            this.feedbackService.showFeedbackDialog.next(true);
          }
        }
      }
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
    if (menu.href !== undefined) {
      if (menu.custom_view_name) {
        menu.href += '&customviewname=' + menu.custom_view_name;
      }

      if (menu.orderBy) {
        menu.href += '&orderBy=' + menu.orderBy;
      }
    }
    menu.children?.forEach((item) => {
      this.dfs(item);
    });
  }
}
