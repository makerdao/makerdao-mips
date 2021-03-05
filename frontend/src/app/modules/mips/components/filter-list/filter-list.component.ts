import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent implements OnInit {
  color: string = 'red';
  items: any[] = [
    {text: 'rfc', color: '#F2994A'},
    {text: 'archive', color: '#748AA1'},
    {text: 'accepted', color: '#27AE60'},
    {text: 'rejected', color: '#EB5757'},
  ];

  constructor() { }

  ngOnInit(): void {

  }

}
