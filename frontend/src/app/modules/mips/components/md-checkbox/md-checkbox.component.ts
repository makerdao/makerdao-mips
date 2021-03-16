import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-md-checkbox',
  templateUrl: './md-checkbox.component.html',
  styleUrls: ['./md-checkbox.component.scss']
})
export class MdCheckboxComponent implements OnInit {
  @Input() label: string = '';
  @Output() checked: Subject<any> = new Subject<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onCheck(event) {
    this.checked.next((event.target as HTMLInputElement).checked);
  }

}
