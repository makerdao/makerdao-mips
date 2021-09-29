import { Component, Input, OnInit } from '@angular/core';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-mip-details',
  templateUrl: './mip-details.component.html',
  styleUrls: ['./mip-details.component.scss']
})
export class MipDetailsComponent implements OnInit {

  @Input() status: string;
  @Input() dateProposed: string;
  @Input() dateRatified: string;
  @Input() ratifiedDataLink:string;
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

  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
  }

  getStatusValue(data: string): string {
    return this.statusService.getStatusValue(data);
  }

  getStatusType(data: string): string {
    return this.statusService.getStatusType(data);
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
