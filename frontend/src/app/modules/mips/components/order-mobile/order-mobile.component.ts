import { animate, style, transition, trigger } from '@angular/animations';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, OnInit, EventEmitter, Output, Input, ElementRef, HostListener, OnChanges } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order, OrderFieldName } from '../../types/order';



@Component({
  selector: 'app-order-mobile',
  templateUrl: './order-mobile.component.html',
  styleUrls: ['./order-mobile.component.scss'],
  animations: [
    trigger('enterLeaveSmooth', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate(50, style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [animate(100, style({ opacity: 0 }))]),
    ]),
  ],
})
export class OrderMobileComponent implements OnInit, OnChanges {

  pos = 1;
  pos1 = 1;
  @Output() sendOrder = new EventEmitter<{
    orderText: string;
    orderObj: Order;
  }>();
  up = true;
  orderBy: OrderFieldName;
  order = '';
  @Input() orderByField: OrderFieldName;
  @Input() orderDirection: string;
  open = false;
  positionPopup: ConnectedPosition[] = new Array<ConnectedPosition>();

  constructor(
    private eRef: ElementRef,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.initPositionPopup();
  }

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

    this.orderService.orderObs.next(orderObj);

    this.sendOrder.emit({
      orderText: this.order || "mip mipName",
      orderObj: orderObj,
    });

    this.open = false;
  }
  reset(): void {
    this.pos = 0;
    this.pos1 = 1;
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

  initPositionPopup() {
    this.positionPopup = [
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
    ];
  }

  onClickOutside(ev: MouseEvent) {
    ev.stopPropagation();
    this.open = false;
  }
}
