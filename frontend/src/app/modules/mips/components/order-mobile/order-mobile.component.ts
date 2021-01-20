import { Component, OnInit, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-order-mobile',
  templateUrl: './order-mobile.component.html',
  styleUrls: ['./order-mobile.component.scss']
})
export class OrderMobileComponent implements OnInit {

  pos = 1;
  pos1 = 1;
  showFrame = false;
  @Output() sendOrder = new EventEmitter<string>();
  up = true;

  constructor() { }

  ngOnInit(): void {
  }

  updatePos(pos: number): void {
    this.pos = pos;
  }

  updatePosDown(pos: number): void {
    this.pos1 = pos;
  }

  apply(): void {
    if (this.pos1 === 1) {
      this.onSendOrderASC();
    } else {
      this.onSendOrderDES();
    }
    this.showFrame = false;
  }
  reset(): void {
    this.pos = 0;
    this.up = true;
    this.apply();
    this.pos = 1;
  }

  transforValue(pos: number): string {
    switch (pos) {
      case 0: return '';
      case 1: return 'mip';
      case 2: return 'title';
      case 3:  return 'sentenceSummary';
      case 4: return 'status';
    }
  }

  onSendOrderASC(): void {
    this.sendOrder.emit(this.transforValue(this.pos));
  }
  onSendOrderDES(): void {
    if (this.pos !== 0) {
      this.sendOrder.emit('-' + this.transforValue(this.pos));
    } else {
      this.sendOrder.emit(this.transforValue(this.pos));
    }
  }

}
