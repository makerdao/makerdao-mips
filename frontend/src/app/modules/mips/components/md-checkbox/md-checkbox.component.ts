import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-md-checkbox',
  templateUrl: './md-checkbox.component.html',
  styleUrls: ['./md-checkbox.component.scss']
})
export class MdCheckboxComponent implements OnInit {
  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
