import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-list-item',
  templateUrl: './filter-list-item.component.html',
  styleUrls: ['./filter-list-item.component.scss']
})
export class FilterListItemComponent implements OnInit {
  @Input() text: string = '';
  @Input() color: string = "";
  @Input() imageClose ? = '../../../../../assets/images/close.png';

  constructor() { }

  ngOnInit(): void {

  }

  get style() {
    return  {
      color: this.color,
      borderColor: this.color
    };
  }



}
