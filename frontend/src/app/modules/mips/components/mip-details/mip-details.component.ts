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
  @Input() mipName: string;
  @Input() title: string;
  @Input() authors: string[];
  @Input() contributors: string[];
  @Input() type: string;
  @Input() lastOpened: string;
  @Input() dependencies: string[];
  @Input() replaces: string;
  @Input() pollAddress: string;
  @Input() tags: string[];

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
      if (data.toLocaleLowerCase().includes('obsolete')) {
        return 'OBSOLETE';
      }
      if (data.toLocaleLowerCase().includes('submission')) {
        return 'FORMAL SUBMISSION';
      }
    }

    return data;
  }

  getStatusType(data: string): string {
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
      if (data.toLocaleLowerCase().includes('obsolete')) {
        return 'OBSOLETE';
      }
      if (data.toLocaleLowerCase().includes('submission')) {
        return 'FS';
      }
    }

    return 'DEFAULT';
  }

  isEmptyWhenReduce(array: string[]): boolean {
    let str: string;
    if (array && array.length > 0) {
      str = array.reduce((c, t) => {
        return (t as string).concat(c);
      });
    }

    return !str ? true : false;
  }

}
