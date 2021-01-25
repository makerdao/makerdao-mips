import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

const preambleDataSample = [
  {
    key: 'MIP#',
    value: '2'
  },
  {
    key: 'Title',
    value: 'Launch Period'
  },
  {
    key: 'Author(s)',
    value: 'Rune Christensen (@Rune23), Charles St.Louis (@CPSTL)'
  },
  {
    key: 'Contributors',
    value: 'Rune Christensen (@Rune23), Charles St.Louis (@CPSTL)'
  },
  {
    key: 'Type',
    value: 'Process'
  },
  {
    key: 'Status',
    value: 'Accepted'
  },
  {
    key: 'Date Proposed',
    value: '2020-04-06'
  },
  {
    key: 'Date Ratified',
    value: '2020-05-02'
  },
  {
    key: 'Dependencies',
    value: 'MIP0, MIP1'
  },
  {
    key: 'Replaces',
    value: 'n/a'
  }
];

@Component({
  selector: 'app-detail-content',
  templateUrl: './detail-content.component.html',
  styleUrls: ['./detail-content.component.scss']
})
export class DetailContentComponent implements OnInit {
  gitgubUrl = environment.repoUrl;
  @Input() mip: any;
  constructor() { }

  ngOnInit(): void {
    const regEx = new RegExp('(.)*');
    this.mip.file = this.mip.file.replace(regEx, ' ');
  }

}
