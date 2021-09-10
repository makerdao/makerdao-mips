import { Component, OnInit, EventEmitter, Output, Input, ElementRef, HostListener, OnChanges } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order, OrderFieldName } from '../../types/order';



@Component({
  selector: 'app-order-mobile',
  templateUrl: './order-mobile.component.html',
  styleUrls: ['./order-mobile.component.scss']
})
export class OrderMobileComponent implements OnInit, OnChanges {

  pos = 1;
  pos1 = 1;
  showFrame = false;
  @Output() sendOrder = new EventEmitter<{
    orderText: string;
    orderObj: Order;
  }>();
  up = true;
  inside = false;
  orderBy: OrderFieldName;
  order = '';
  @Input() orderByField: OrderFieldName;
  @Input() orderDirection: string;

  @HostListener('document:click', ['$event'])
  clickout(event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (this.inside && this.showFrame) {
        this.inside = false;
      } else {
        this.showFrame = false;
      }
    }
  }

  constructor(
    private eRef: ElementRef,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {}

  ngOnChanges() {
    let p = 0;
    switch (this.orderByField) {
      case undefined:
        p = 1;
        break;
      case OrderFieldName.Number:
        p = 1;
        break;
      case OrderFieldName.Title:
        p = 2;
        break;
      case OrderFieldName.Summary:
        p = 3;
        break;
      case OrderFieldName.Status:
        p = 4;
        break;
      default:
        break;
    }

    this.pos = p;

    switch (this.orderDirection) {
      case undefined:
        this.pos1 = 1;
        break;
      case 'ASC':
        this.pos1 = 1;
        break;
      case 'DESC':
        this.pos1 = 2;
        break;
      default:
        break;
    }
  }

  updatePos(pos: number): void {
    this.pos = pos;
  }

  updatePosDown(pos: number): void {
    this.pos1 = pos;
  }

  apply(): void {
    let orderPrefix = this.pos1 === 1 ? '' : '-';
    this.order = orderPrefix + this.transforValue(this.pos);
    let orderObj: Order = {
      field: this.orderBy,
      direction: this.pos1 === 1 ? 'ASC' : 'DESC',
    };
    this.orderService.order = orderObj;

    this.sendOrder.emit({
      orderText: this.order,
      orderObj: orderObj,
    });

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
      case 0:
        this.orderBy = OrderFieldName.Number;
        return '';
      case 1:
        this.orderBy = OrderFieldName.Number;
        return 'mip';
      case 2:
        this.orderBy = OrderFieldName.Title;
        return 'title';
      case 3:
        this.orderBy = OrderFieldName.Summary;
        return 'sentenceSummary';
      case 4:
        this.orderBy = OrderFieldName.Status;
        return 'status';
    }
  }

  showHideFrame(): void {
    if (!this.showFrame) {
      this.inside = true;
    }

    this.showFrame = !this.showFrame;
  }

}
