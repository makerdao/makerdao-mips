import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


const sampleData = [
  {
    title: 'TItle 1',
    summary: 'This is my summary number 1',
    status: 'acepted',
    github: '1.github.com',
    forum: 'forum.com/1'
  },
  {
    title: 'TItle 2',
    summary: 'This is my summary number 2',
    status: 'acepted',
    github: '2.github.com',
    forum: 'forum.com/2'
  },
  {
    title: 'TItle 3',
    summary: 'This is my summary number 3',
    status: 'acepted',
    github: '3.github.com',
    forum: 'forum.com/3'
  },
  {
    title: 'TItle 4',
    summary: 'This is my summary number 4',
    status: 'acepted',
    github: '4.github.com',
    forum: 'forum.com/4'
  },
  {
    title: 'TItle 5',
    summary: 'This is my summary number 5',
    status: 'acepted',
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



  displayedColumns: string[] = ['title', 'summary', 'status', 'github', 'forum'];
  dataSource = new MatTableDataSource(sampleData);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

}
