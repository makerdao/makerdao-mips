import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-md-checkbox-mobile',
  templateUrl: './md-checkbox-mobile.component.html',
  styleUrls: ['./md-checkbox-mobile.component.scss']
})
export class MdCheckboxMobileComponent implements OnInit {
  @Input() label: string = '';
  @Input() imageNoChecked: string = "";
  @Input() imageChecked: string = "";
  @Output() checked: Subject<any> = new Subject<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onCheck(event) {
    this.checked.next((event.target as HTMLInputElement).checked);
  }

}
