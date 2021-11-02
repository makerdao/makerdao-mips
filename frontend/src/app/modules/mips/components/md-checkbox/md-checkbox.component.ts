import { AfterViewInit, Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-md-checkbox',
  templateUrl: './md-checkbox.component.html',
  styleUrls: ['./md-checkbox.component.scss']
})
export class MdCheckboxComponent implements OnInit, AfterViewInit {
  @Input() label: string = '';
  @Output() checked: Subject<any> = new Subject<any>();
  @Input() checkInput: boolean;
  check: boolean = false;

  constructor(
    public darkModeService:DarkModeService
  ) { }

  ngOnInit(): void {
  }

  onCheck(event) {
    this.checked.next((event.target as HTMLInputElement).checked);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.check = this.checkInput;
    }, 100);
  }

}
