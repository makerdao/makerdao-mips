import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-asc-des',
  templateUrl: './asc-des.component.html',
  styleUrls: ['./asc-des.component.scss'],
})
export class AscDesComponent implements OnInit {
  @Input() direction = -1 | 0 | 1;

  constructor() {}

  ngOnInit(): void {}
}
