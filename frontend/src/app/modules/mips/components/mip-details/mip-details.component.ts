import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mip-details',
  templateUrl: './mip-details.component.html',
  styleUrls: ['./mip-details.component.scss']
})
export class MipDetailsComponent implements OnInit {

  @Input() status: string;
  @Input() dateProposed: string;
  @Input() dateRatified: string;

  constructor() { }

  ngOnInit(): void {
  }

  getStatusValue(data: string): string {
    if (data !== undefined) {
      if (data.toLocaleLowerCase().includes('accepted')) {
          return 'ACCEPTED';
      }
      if (data.toLocaleLowerCase().includes('rfc')) {
        return 'RFC';
      }
      if (data.toLocaleLowerCase().includes('rejected')) {
        return 'REJECTED';
      }
      if (data.toLocaleLowerCase().includes('archived')) {
        return 'ARCHIVED';
      }
    }

    // return data;
  }

}
