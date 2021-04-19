import { Component, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import Menu from '../../data-types/menu';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit {
  @Output() menuOpen: Subject<boolean> = new Subject<boolean>();
  menu: Menu[] = [
    {
      id: 'colors',
      name: 'Colors3',
      href: '',
      children: [
        {
          id: 'red',
          name: 'Red testing',
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
            {
              id: 'red3',
              name: 'Red 3 Testing testing',
              href: '',
              children: [
                {
                  id: 'red31',
                  name: 'Red 3.1 Testing testing',
                  href: '',
                  children: [
                    {
                      id: 'red311',
                      name: 'Red 3.1.1 Testing testing testing testing',
                      href: '',
                      children: [
                        {
                          id: 'red1',
                          name: 'Red 1',
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
                          id: 'red2',
                          name: 'Red 2',
                          href: '',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'red3.2',
                  name: 'Red 3.2',
                  href: '',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 'blue',
          name: 'Blue',
          href: '',
          children: [
            {
              id: 'blue',
              name: 'Blue 1',
              href: '',
              children: [],
            },
            {
              id: 'blue',
              name: 'Blue 2',
              href: '',
              children: [],
            },
            {
              id: 'blue',
              name: 'Blue 3 Testing testing',
              href: '',
              children: [
                {
                  id: 'blue',
                  name: 'Blue 3.1 Testing testing',
                  href: '',
                  children: [
                    {
                      id: 'blue',
                      name: 'Blue 3.1.1 Testing testing testing testing',
                      href: '',
                      children: [
                        {
                          id: 'blue',
                          name: 'Blue 3.1.1.1',
                          href: '',
                          children: [
                            {
                              id: 'blue',
                              name: 'Ocean',
                              href: '',
                              children: [],
                            },
                            {
                              id: 'blue',
                              name: 'Sky',
                              href: '',
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'blue',
                          name: 'Blue 2',
                          href: '',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'colors',
      name: 'Colors2',
      href: '',
      children: [
        {
          id: 'red',
          name: 'Red testing',
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
            {
              id: 'red3',
              name: 'Red 3 Testing testing',
              href: '',
              children: [
                {
                  id: 'red31',
                  name: 'Red 3.1 Testing testing',
                  href: '',
                  children: [
                    {
                      id: 'red311',
                      name: 'Red 3.1.1 Testing testing testing testing',
                      href: '',
                      children: [
                        {
                          id: 'red1',
                          name: 'Red 1',
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
                          id: 'red2',
                          name: 'Red 2',
                          href: '',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'red3.2',
                  name: 'Red 3.2',
                  href: '',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 'blue',
          name: 'Blue',
          href: '',
          children: [
            {
              id: 'blue',
              name: 'Blue 1',
              href: '',
              children: [],
            },
            {
              id: 'blue',
              name: 'Blue 2',
              href: '',
              children: [],
            },
            {
              id: 'blue',
              name: 'Blue 3 Testing testing',
              href: '',
              children: [
                {
                  id: 'blue',
                  name: 'Blue 3.1 Testing testing',
                  href: '',
                  children: [
                    {
                      id: 'blue',
                      name: 'Blue 3.1.1 Testing testing testing testing',
                      href: '',
                      children: [
                        {
                          id: 'blue',
                          name: 'Blue 3.1.1.1',
                          href: '',
                          children: [
                            {
                              id: 'blue',
                              name: 'Ocean',
                              href: '',
                              children: [],
                            },
                            {
                              id: 'blue',
                              name: 'Sky',
                              href: '',
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'blue',
                          name: 'Blue 2',
                          href: '',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'colors',
      name: 'Colors',
      href: '',
      children: [
        {
          id: 'red',
          name: 'Red testing',
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
            {
              id: 'red3',
              name: 'Red 3 Testing testing',
              href: '',
              children: [
                {
                  id: 'red31',
                  name: 'Red 3.1 Testing testing',
                  href: '',
                  children: [
                    {
                      id: 'red311',
                      name: 'Red 3.1.1 Testing testing testing testing',
                      href: '',
                      children: [
                        {
                          id: 'red1',
                          name: 'Red 1',
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
                          id: 'red2',
                          name: 'Red 2',
                          href: '',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'red3.2',
                  name: 'Red 3.2',
                  href: '',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 'blue',
          name: 'Blue',
          href: '',
          children: [
            {
              id: 'blue',
              name: 'Blue 1',
              href: '',
              children: [],
            },
            {
              id: 'blue',
              name: 'Blue 2',
              href: '',
              children: [],
            },
            {
              id: 'blue',
              name: 'Blue 3 Testing testing',
              href: '',
              children: [
                {
                  id: 'blue',
                  name: 'Blue 3.1 Testing testing',
                  href: '',
                  children: [
                    {
                      id: 'blue',
                      name: 'Blue 3.1.1 Testing testing testing testing',
                      href: '',
                      children: [
                        {
                          id: 'blue',
                          name: 'Blue 3.1.1.1',
                          href: '',
                          children: [
                            {
                              id: 'blue',
                              name: 'Ocean',
                              href: '',
                              children: [],
                            },
                            {
                              id: 'blue',
                              name: 'Sky',
                              href: '',
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'blue',
                          name: 'Blue 2',
                          href: '',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'menu',
      name: 'Menu',
      href: '',
      children: [
        {
          id: 'Sub menu',
          name: 'Sub menu',
          href: '',
          children: []
        }
      ]
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  onMenuToggle(ev) {
    this.menuOpen.next(ev);
  }
}
