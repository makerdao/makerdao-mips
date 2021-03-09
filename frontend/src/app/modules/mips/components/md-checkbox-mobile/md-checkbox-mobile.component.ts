import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-md-checkbox-mobile',
  templateUrl: './md-checkbox-mobile.component.html',
  styleUrls: ['./md-checkbox-mobile.component.scss']
})
export class MdCheckboxMobileComponent implements OnInit {
  @Input() label: string = '';
  @Input() imageNoChecked: string = "";
  @Input() imageChecked: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
