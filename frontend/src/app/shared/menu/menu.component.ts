import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import { MenuService } from 'src/app/services/menu/menu.service';
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
  @Input() showArrow: boolean = true;
  @Input() isLanguageMenu?:boolean=false;
  
  constructor(
    private menuService: MenuService,
    public darkModeService: DarkModeService
  ) {}

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
      const positionX = (ev.currentTarget as HTMLElement).getClientRects()[0]
        .left;

      const movePositionX =
        window.innerWidth > 500 ? positionX - 90 : positionX - 30;

      this.menuService.setposXClicked(movePositionX);
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
        this.menuService.setClicked(this.menu);
        this.closeMenu();
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
        this.menuService.setClicked(this.menu);
        this.closeMenu();
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
}
