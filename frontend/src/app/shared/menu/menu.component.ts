import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import Menu from '../../data-types/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() menu: Menu;
  isOpen: boolean = false;
  @Output() clickedBackdrop: Subject<boolean> = new Subject<boolean>();
  @Input() level: number = 0;
  position: ConnectedPosition[] = new Array<ConnectedPosition>();

  constructor() {
  }

  ngOnInit(): void {
    this.initPosition();
  }

  initPosition() {
    let posItem: ConnectedPosition;

    if (this.level <= 0) {
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
  }

  onClick() {
    if (this.menu.children && this.menu.children.length > 0) {
      this.isOpen = !this.isOpen;
    } else {
      window.location.href = this.menu.href;
    }
  }
}
