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

  constructor() {}

  ngOnInit(): void {}

  onClickedBackdrop() {
    this.isOpen = false;
    this.clickedBackdrop.next(false);
  }

  closeMenu() {
    this.isOpen = false;
  }
}
