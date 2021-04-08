import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import Menu from '../../data-types/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnChanges {
  @Input() menu: Menu;
  isOpen: boolean = false;
  @Output() clickedBackdrop: Subject<boolean> = new Subject<boolean>();
  @Input() levelMenu: number = 0;
  position: ConnectedPosition[] = new Array<ConnectedPosition>();
  @Output() opened: Subject<any> = new Subject<any>();
  @Input() openedIndex: number = -1;
  openedIndexChild: number = -1;
  @Input() index: number;

  constructor() {
  }

  ngOnInit(): void {
    this.initPosition();
  }

  ngOnChanges() {
    this.isOpen = this.openedIndex === this.index;
    this.openedIndexChild = this.isOpen ? this.openedIndexChild : -1;
  }

  initPosition() {
    let posItem: ConnectedPosition;

    if (this.levelMenu <= 0) {
      posItem = {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      };
      this.position.push({...posItem});
    } else {
      posItem = {
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
      };
      this.position.push({...posItem});

      posItem = {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
      };
      this.position.push({...posItem});

      posItem = {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      };
      this.position.push({...posItem});

      posItem = {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      };
      this.position.push({...posItem});
    }
  }

  onClickedBackdrop() {
    this.closeMenu();
  }

  closeMenu() {
    this.clickedBackdrop.next(false);
    this.isOpen = false;
    this.openedIndex = -1;
    this.openedIndexChild = -1;
  }

  onClick() {
    if (window.innerWidth >= 768) {
      if (this.menu.children && this.menu.children.length > 0) {
        this.isOpen = !this.isOpen;
      } else {
        window.location.href = this.menu.href;
      }
    } else {
      this.isOpen = true;
      this.opened.next();
    }
  }

  open() {
    this.isOpen = this.levelMenu > 0 ? true : false;
    this.opened.next();
  }

  onOpened(index: number) {
    this.openedIndexChild = index;
  }
}
