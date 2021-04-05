import { Component, OnInit } from '@angular/core';
import Menu from '../../data-types/menu';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  menu: Menu[] = [
    {
      id: 'colors',
      name: 'Colors',
      href: '',
      children: [
        {
          id: 'red',
          name: 'Red',
          href: '',
          children: [
            {
              id: 'red1',
              name: 'Red 1',
              href: '',
              children: [],
            },
            {
              id: 'red2',
              name: 'Red 2',
              href: '',
              children: [],
            },
          ],
        },
        {
          id: 'blue',
          name: 'Blue',
          href: '',
          children: [],
        },
      ],
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
