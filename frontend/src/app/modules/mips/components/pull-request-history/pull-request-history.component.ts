import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

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

  getDifferenceInDays(date): number {
    const today = moment();
    return today.diff(date, 'days');
  }

  goToMipsPullHistory(): void {
    window.location.href = this.pullrequest.url;
  }

}
