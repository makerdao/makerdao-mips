import { AfterViewInit, Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-md-checkbox-mobile',
  templateUrl: './md-checkbox-mobile.component.html',
  styleUrls: ['./md-checkbox-mobile.component.scss'],
})
export class MdCheckboxMobileComponent implements OnInit, AfterViewInit {
  @Input() label: string = '';
  @Input() imageNoChecked: string = '';
  @Input() imageChecked: string = '';
  @Output() checked: Subject<any> = new Subject<any>();
  @Input() checkInput: boolean;
  check: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onCheck(event) {
    this.checked.next((event.target as HTMLInputElement).checked);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.check = this.checkInput;
    }, 100);
  }
}
