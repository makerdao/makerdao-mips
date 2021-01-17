import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mips-pagination',
  templateUrl: './mips-pagination.component.html',
  styleUrls: ['./mips-pagination.component.scss']
})
export class MipsPaginationComponent implements OnInit {

  @Input() mipId: string;
  constructor() { }

  ngOnInit(): void {
  }

}
