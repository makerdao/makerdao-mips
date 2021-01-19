import { Component, OnInit, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-order-mobile',
  templateUrl: './order-mobile.component.html',
  styleUrls: ['./order-mobile.component.scss']
})
export class OrderMobileComponent implements OnInit {

  pos = 0;
  showFrame = false;
  @Output() sendOrder = new EventEmitter<string>();
  up = true;

  constructor() { }

  ngOnInit(): void {
  }

  updatePos(pos: number): void {
    this.pos = pos;
  }

  apply(): void {
    if (this.up) {
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
