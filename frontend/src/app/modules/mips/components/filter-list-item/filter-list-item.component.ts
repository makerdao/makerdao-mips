import { Component, ComponentRef, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
var Color = require('color');

@Component({
  selector: 'app-filter-list-item',
  templateUrl: './filter-list-item.component.html',
  styleUrls: ['./filter-list-item.component.scss']
})
export class FilterListItemComponent implements OnInit {
  @Input() text: string = '';
  @Input() value: string = '';
  @Input() id: string;
  @Input() color: string = "";
  @Input() imageClose ? = '../../../../../assets/images/close.png';
  @Input() selfRef: ComponentRef<FilterListItemComponent>;
  @Output() closed: Subject<any> = new Subject<any>();
  private borderColor;

  constructor() { }

  ngOnInit(): void {
  }

  get style() {
    this.borderColor = Color(this.color).alpha(0.5);

    return  {
      color: this.color,
      borderColor: this.borderColor
    };
  }

  close() {
    this.closed.next(this.value);
    this.selfRef.destroy();
  }

  destroy() {
    this.selfRef.destroy();
  }

}
