import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pull-request-history',
  templateUrl: './pull-request-history.component.html',
  styleUrls: ['./pull-request-history.component.scss']
})
export class PullRequestHistoryComponent implements OnInit {

  @Input() pullrequest: any;
  constructor() { }

  ngOnInit(): void {
  }

  getPullNumber(url: string): string {
    const data = url.split('/');
    return data[data.length - 1];
  }

  // getDifferenceInDays(date1): number {
  //   let date2 = new Date();
  //   const diffInMs = Math.abs(date2 - date1);
  //   return diffInMs / (1000 * 60 * 60 * 24);
  // }

}
