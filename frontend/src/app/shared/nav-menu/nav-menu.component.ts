import { Component, HostBinding, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { FeedbackService } from '../../modules/mips/services/feedback.service';
import { LangService } from '../../services/lang/lang.service';
import { MenuService } from '../../services/menu/menu.service';
import { UrlService } from '../../services/url/url.service';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';
import Menu from '../../data-types/menu';
import { HttpUrlEncodingCodec } from '@angular/common/http';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit {
  @Output() menuOpen: Subject<boolean> = new Subject<boolean>();
  openedIndexChild = -1;
  menu: Menu[] = [];
  menuLang: Menu = null;
  codec = new HttpUrlEncodingCodec();

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
    private feedbackService: FeedbackService,
    public darkModeService: DarkModeService,
    private langService: LangService
  ) {}

  ngOnInit(): void {
    this.menuService.getMenu().subscribe((data: any) => {
      this.menu = data.data;
      const newMenu: Menu = {
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
        } else if (data.id === this.feedBackLinkMenu.id) {
          this.feedbackService.showFeedbackDialog.next(true);
        } else if (data.id !== this.menuLang.id) {
          const index: number = this.menuLang.children.findIndex(
            (i) => i.id === data.id
          );

          if (index !== -1) {
            this.langService.setCurrentLang(this.menuLang.children[index].id);
            this.swapLang(data);

            location.reload(); // TODO: make it SPA
          }
        }
      }
    });

    this.menuService.getMenuLang().subscribe((data: any) => {
      const currentLang = this.langService.lang;

      const children = data.children.map((item) =>
        item.id === currentLang ? { ...item, activeLangue: true } : item
      );

      this.menuLang = {
        ...data,
        children,
      };
    });
  }

  swapLang(data: Menu): void {
    const children = this.menuLang.children.map((item) => {
      if (item.id === data.id) {
        return {
          ...item,
          activeLangue: true,
        };
      } else {
        return {
          ...item,
          activeLangue: false,
        };
      }
    });

    this.menuLang = {
      ...this.menuLang,
      children,
    };
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  sortLangItems(): void {
    this.menuLang.children.sort((a: Menu, b: Menu) =>
      a.name < b.name ? -1 : 1
    );
  }

  onMenuToggle(ev): void {
    this.menuOpen.next(ev);
  }

  onOpened(index: number): void {
    this.openedIndexChild = index;
    this.menuService.setOpenedIndexChild(index);
  }

  @HostBinding('class.activeChild')
  get activeChild(): boolean {
    return this.openedIndexChild !== -1;
  }

  dfs(menu: Menu): void {
    if (menu.href !== undefined) {
      if (!menu.href.includes('?')) {
        menu.href = menu.href + '?';
      }

      if (menu.custom_view_name) {
        menu.href += '&customViewName=' + menu.custom_view_name;
      }

      if (menu.orderBy) {
        menu.href += '&orderBy=' + menu.orderBy;
      }

      if (menu.orderDirection) {
        menu.href += '&orderDirection=' + menu.orderDirection;
      }

      if (menu.queries) {
        menu.queries.forEach((query) => {
          menu.href +=
            '&_' + query.id + '=$' + this.codec.encodeValue(query.query);
        });
      }
    }
    menu.children?.forEach((item) => {
      this.dfs(item);
    });
  }

  closeMenuOnScroll(): void{
    this.openedIndexChild = (-1);
  }
}
