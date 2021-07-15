import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import {environment as env} from 'src/environments/environment';

@Component({
  selector: 'app-pull-request-history',
  templateUrl: './pull-request-history.component.html',
  styleUrls: ['./pull-request-history.component.scss']
})
export class PullRequestHistoryComponent implements OnInit {

  @Input() pullrequest: any;

  githubURL: string;

  constructor() {
    this.githubURL = env.githubURL;
  }

  ngOnInit(): void {}

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
