import { Component, OnInit } from '@angular/core';

const sampleData = [
  {
    title: 'Preamble',
    subtitles: []
  },
  {
    title: 'References',
    subtitles: []
  },
  {
    title: 'Sentence Summary ',
    subtitles: []
  },
  {
    title: 'Paragraph Summary',
    subtitles: []
  },
  {
    title: 'Specification / Proposal Detail',
    subtitles: [
      {
        title: 'MIP2c1: Interim Phase 1'
      },
      {
        title: 'MIP2c1: Interim Phase 1'
      },
      {
        title: 'MIP2c1: Interim Phase 1'
      }
    ]
  }
]

@Component({
  selector: 'app-proposal-components',
  templateUrl: './proposal-components.component.html',
  styleUrls: ['./proposal-components.component.scss']
})
export class ProposalComponentsComponent implements OnInit {

  sourceData = sampleData;
  marketPosition = 0;
  constructor() { }

  ngOnInit(): void {
  }

  updatePos(index): void {
    this.marketPosition = (index + 1) * 10;
  }

}
