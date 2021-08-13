import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UrlService } from 'src/app/services/url/url.service';
import Menu from '../../data-types/menu';

// mouse direction
var oldY = 0;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnChanges {
  @Input() menu: Menu;
  @Input() isOpen: boolean = false;
  @Output() clickedBackdrop: Subject<boolean> = new Subject<boolean>();
  @Input() levelMenu: number = 0;
  position: ConnectedPosition[] = new Array<ConnectedPosition>();
  @Output() opened: Subject<any> = new Subject<any>();
  @Input() openedIndex: number = -1;
  openedIndexChild: number = -1;
  @Input() index: number;
  @Output() toggle: Subject<any> = new Subject<any>();
  yDirection = '';

  constructor(private menuService: MenuService, private urlService:UrlService) {}

  ngOnInit(): void {
    this.initPosition();
  }

  ngOnChanges() {
    this.isOpen = this.isOpen ? this.isOpen : this.openedIndex === this.index;
    this.openedIndexChild = this.isOpen ? this.openedIndexChild : -1;
  }

  initPosition() {
    if (this.levelMenu <= 0) {
      this.position = [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ];
    } else {
      this.position = [
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ];
    }
  }

  onClickedBackdrop() {
    this.closeMenu();
  }

  closeMenu() {
    this.toggle.next(false);
    this.clickedBackdrop.next(false);
    this.isOpen = false;
    this.openedIndex = -1;
    this.openedIndexChild = -1;
  }

  onClick(ev: Event) {
    if (this.levelMenu === 0) {
      this.menuService.setposXClicked(
        (ev.target as HTMLElement).getClientRects()[0].left
      );
    }

    ev.stopPropagation();
    this.toggle.next(!this.isOpen);

    if (window.innerWidth >= 768) {
      if (this.menu.children && this.menu.children.length > 0) {
        if (this.levelMenu > 0) {
          this.open();
        } else {
          this.isOpen = !this.isOpen;

          if (!this.isOpen) {
            this.closeMenu();
          }

          this.opened.next();
        }
      } else {
        this.goToUrl(this.menu.href);
      }
    } else {
      if (this.menu.children && this.menu.children.length > 0) {
        if (this.levelMenu > 0) {
          this.open();
        } else {
          this.isOpen = !this.isOpen;

          if (!this.isOpen) {
            this.closeMenu();
          }

          this.opened.next();
        }
      } else {
        this.goToUrl(this.menu.href);
      }
    }
  }

  open(e?) {
    if (this.levelMenu > 0) {
      this.isOpen = this.levelMenu > 0 ? true : false;
      this.opened.next();
    }

    if (e) {
      this.getMouseDirection(e);
    }
  }

  onOpened(index: number) {
    this.openedIndexChild = index;
  }

  getMouseDirection(e) {
    if (oldY < e.pageY) {
      this.yDirection = 'down';
    } else {
      this.yDirection = 'up';
    }

    oldY = e.pageY;
  }

  goToUrl(address: string): void {
    this.urlService.goToUrl(address)
    this.closeMenu();
  }
}
