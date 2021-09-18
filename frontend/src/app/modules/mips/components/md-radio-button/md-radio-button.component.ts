import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-md-radio-button',
  templateUrl: './md-radio-button.component.html',
  styleUrls: ['./md-radio-button.component.scss'],
})
export class MdRadioButtonComponent implements OnInit {
  @Input() label: string;

  constructor() {}

  ngOnInit(): void {}
}
