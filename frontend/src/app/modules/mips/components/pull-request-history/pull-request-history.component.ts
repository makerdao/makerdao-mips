import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';

import {environment as env} from 'src/environments/environment';

@Component({
  selector: 'app-pull-request-history',
  templateUrl: './pull-request-history.component.html',
  styleUrls: ['./pull-request-history.component.scss']
})
export class PullRequestHistoryComponent implements OnInit {

  @Input() pullrequest: any;

  githubURL: string;

  constructor(
    public darkModeService:DarkModeService
  ) {
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

  getFilteredItems(): string {
    return this.pullrequest.items.filter(item => item.author != null).slice(0, 3);
  }

}
