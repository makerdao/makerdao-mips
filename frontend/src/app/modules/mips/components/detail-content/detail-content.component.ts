import { Component, OnInit } from '@angular/core';

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
  preamble = preambleDataSample;
  mipId = 'MIP 2';
  mipName = 'Launch Period';
  file = 'MIP28c7-SP1.md';
  sentenceSummary = 'MIP2 details two interim phases during which logic defined in MIP0 is overriden.';
  paragraphSummary = 'This proposal details the process of how Maker Governance can bootstrap the setup and implementation of the first Governance Paradigm. More specifically, it defines two phases: Phase 1: when a core governance framework is put in place and a functional collateral onboarding process is ratified Phase 2: when the Problem Space is in the process of being addressed with MIPs and MIP Sets. Lastly, the proposal states that MIP2 itself will become obsolete when the Problem Space has officially been addressed.'

  constructor() { }

  ngOnInit(): void {
  }

}
