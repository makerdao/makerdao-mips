import { Component, Input, OnInit } from '@angular/core';
var Color = require('color');

@Component({
  selector: 'app-filter-list-item',
  templateUrl: './filter-list-item.component.html',
  styleUrls: ['./filter-list-item.component.scss']
})
export class FilterListItemComponent implements OnInit {
  @Input() text: string = '';
  @Input() color: string = "";
  @Input() imageClose ? = '../../../../../assets/images/close.png';
  borderColor;

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



}
