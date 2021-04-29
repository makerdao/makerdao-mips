import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuService } from 'src/app/services/menu/menu.service';
import Menu from '../../data-types/menu';

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

  constructor(private menuService: MenuService) {}

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
        window.location.href = this.menu.href;
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
        window.location.href = this.menu.href;
      }
    }
  }

  open() {
    if (this.levelMenu > 0) {
      this.isOpen = this.levelMenu > 0 ? true : false;
      this.opened.next();
    }
  }

  onOpened(index: number) {
    this.openedIndexChild = index;
  }
}
