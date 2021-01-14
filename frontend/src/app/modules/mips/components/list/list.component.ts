// import { AfterViewInit, Component, ViewChild } from '@angular/core';
// import {animate, state, style, transition, trigger} from '@angular/animations';

import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

const sampleData: DataElement[] = [
  {
    position: 1,
    title: 'TItle 1',
    summary: 'This is my summary number 1',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '1.github.com',
    forum: 'forum.com/1'
  },
  {
    position: 2,
    title: 'TItle 2',
    summary: 'This is my summary number 2',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '2.github.com',
    forum: 'forum.com/2'
  },
  {
    position: 3,
    title: 'TItle 3',
    summary: 'This is my summary number 3',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '3.github.com',
    forum: 'forum.com/3'
  },
  {
    position: 4,
    title: 'TItle 4',
    summary: 'This is my summary number 4',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '4.github.com',
    forum: 'forum.com/4'
  },
  {
    position: 5,
    title: 'TItle 5',
    summary: 'This is my summary number 5',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'REJECTED',
    github: '5.github.com',
    forum: 'forum.com/5'
  },
];

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListComponent {


  columnsToDisplay = ['#', 'title', 'summary', 'status', 'link'];
  dataSource = sampleData;
  expandedElement: DataElement | null;

}

export interface DataElement {
  position: number;
  title: string;
  summary: string;
  paragraph: string;
  status: string;
  github: string;
  forum: string;
}

