import { ConnectedPosition } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import Menu from '../../data-types/menu';

// mouse direction
let oldY = 0;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnChanges {
  @Input() menu: Menu;
  @Input() isOpen = false;
  @Output() clickedBackdrop: Subject<boolean> = new Subject<boolean>();
  @Input() levelMenu = 0;
  position: ConnectedPosition[] = new Array<ConnectedPosition>();
  @Output() opened: Subject<any> = new Subject<any>();
  @Input() openedIndex = -1;
  openedIndexChild = -1;
  @Input() index: number;
  @Output() toggle: Subject<any> = new Subject<any>();
  yDirection = '';
  @Input() showArrow = true;
  @Input() isLanguageMenu = false;

  constructor(
    private menuService: MenuService,
    public darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.initPosition();
  }

  ngOnChanges(): void {
    this.isOpen = this.isOpen ? this.isOpen : this.openedIndex === this.index;
    this.openedIndexChild = this.isOpen ? this.openedIndexChild : -1;
  }

  initPosition(): void {
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
      ];
    }
  }

  onClickedBackdrop(): void {
    this.closeMenu();
  }

  closeMenu(): void {
    this.toggle.next(false);
    this.clickedBackdrop.next(false);
    this.isOpen = false;
    this.openedIndex = -1;
    this.openedIndexChild = -1;
  }

  onClick(ev: Event): void {
    if (this.levelMenu === 0) {
      const positionX = (ev.currentTarget as HTMLElement).getClientRects()[0]
        .left;

      const movePositionX =
        window.innerWidth > 500 ? positionX - 40 : positionX - 30;

      console.log({ movePositionX });
      this.menuService.setsXClicked(movePositionX);
    }
    ev.stopPropagation();
    this.toggle.next(!this.isOpen);
    setTimeout(() => {
     

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
    }, 200);
  }

  open(e?): void {
    if (this.levelMenu > 0) {
      this.isOpen = this.levelMenu > 0;
      this.opened.next();
    }

    if (e) {
      this.getMouseDirection(e);
    }
  }

  onOpened(index: number): void {
    this.openedIndexChild = index;
  }

  getMouseDirection(e): void {
    if (oldY < e.pageY) {
      this.yDirection = 'down';
    } else {
      this.yDirection = 'up';
    }
  }
}
