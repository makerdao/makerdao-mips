import { AfterViewInit, Component, ViewChild } from '@angular/core';

const sampleData = [
  {
    title: 'TItle 1',
    summary: 'This is my summary number 1',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '1.github.com',
    forum: 'forum.com/1'
  },
  {
    title: 'TItle 2',
    summary: 'This is my summary number 2',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '2.github.com',
    forum: 'forum.com/2'
  },
  {
    title: 'TItle 3',
    summary: 'This is my summary number 3',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '3.github.com',
    forum: 'forum.com/3'
  },
  {
    title: 'TItle 4',
    summary: 'This is my summary number 4',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '4.github.com',
    forum: 'forum.com/4'
  },
  {
    title: 'TItle 5',
    summary: 'This is my summary number 5',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '5.github.com',
    forum: 'forum.com/5'
  },
];

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements AfterViewInit {



  displayedColumns: string[] = ['TITLE', 'SUMMARY', 'STATUS', 'LINK'];
  dataSource = sampleData;

  ngAfterViewInit(): void {}

  getData(data) {
    console.log('data ' + data);
  }

}
