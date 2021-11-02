import { animate, style, transition, trigger } from '@angular/animations';
import { ConnectedPosition } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
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
  @Output() sendOrder = new EventEmitter<{
    orderText: string;
    orderObj: Order;
  }>();
  orderBy: OrderFieldName;
  order = '';
  @Input() orderByField: OrderFieldName;
  @Input() orderDirection: string;
  open = false;
  positionPopup: ConnectedPosition[] = new Array<ConnectedPosition>();

  orderByForm = new FormGroup({
    order: new FormControl('mip'),
  });

  orderDirectionForm = new FormGroup({
    direction: new FormControl(''),
  });

  constructor(
    private orderService: OrderService,
    public darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.initPositionPopup();
  }

  ngOnChanges() {
    let field: string;

    switch (this.orderByField) {
      case undefined:
        field = 'mip';
        break;
      case OrderFieldName.Number:
        field = 'mip';
        break;
      case OrderFieldName.Title:
        field = 'title';
        break;
      case OrderFieldName.Summary:
        field = 'sentenceSummary';
        break;
      case OrderFieldName.Status:
        field = 'status';
        break;
      default:
        break;
    }

    this.orderByForm.get('order').setValue(field);

    switch (this.orderDirection) {
      case undefined:
        this.orderDirectionForm.get('direction').setValue('');
        break;
      case 'ASC':
        this.orderDirectionForm.get('direction').setValue('');
        break;
      case 'DESC':
        this.orderDirectionForm.get('direction').setValue('-');
        break;
      default:
        break;
    }
  }

  apply(): void {
    let orderPrefix = this.orderDirectionForm.get('direction').value;
    this.order = orderPrefix + this.orderByForm.get('order').value;
    this.orderBy = this.getOrderByFieldName(
      this.orderByForm.get('order').value
    );

    let orderObj: Order = {
      field: this.orderBy,
      direction:
        this.orderDirectionForm.get('direction').value === '' ? 'ASC' : 'DESC',
    };

    this.orderService.order = orderObj;
    this.orderService.orderObs.next(orderObj);

    this.sendOrder.emit({
      orderText: this.order || 'mip mipName',
      orderObj: orderObj,
    });

    this.open = false;
  }

  reset(): void {
    this.orderByForm.get('order').reset('mip');
    this.orderDirectionForm.get('direction').reset('');
    this.apply();
  }

  getOrderByFieldName(field: string): OrderFieldName {
    let fieldName: OrderFieldName;

    switch (field) {
      case '':
        fieldName = OrderFieldName.Number;
        break;
      case 'mip':
        fieldName = OrderFieldName.Number;
        break;
      case 'title':
        fieldName = OrderFieldName.Title;
        break;
      case 'sentenceSummary':
        fieldName = OrderFieldName.Summary;
        break;
      case 'status':
        fieldName = OrderFieldName.Status;
        break;
    }

    return fieldName;
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
