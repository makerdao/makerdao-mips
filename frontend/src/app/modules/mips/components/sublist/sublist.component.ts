import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sublist',
  templateUrl: './sublist.component.html',
  styleUrls: ['./sublist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SublistComponent implements OnInit {
  @Input() subsetChildrenActivate: boolean = true;
  @Input() dataSource: any;
  columnsToDisplaySubsetChildren = [
    'pos',
    'title',
    'summary',
    'status',
    'link',
  ];
  selected = '-1';
  expandedElementSubsetChildren: DataElement | null;
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  _expandedItems: ExpandedItems = {
    subproposals: false,
    summary: false,
  };

  get expandedItems() {
    return this._expandedItems;
  }

  set expandedItems(value) {
    this._expandedItems = { ...value };
  }

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onNavigateToDetails(name) {
    this.router.navigate(['/mips/details/', name]);
  }

  getStatusType(data: string): string {
    if (data !== undefined) {
      if (data.toLocaleLowerCase().includes('accepted')) {
        return 'ACCEPTED';
      }
      if (data.toLocaleLowerCase().includes('rfc')) {
        return 'RFC';
      }
      if (data.toLocaleLowerCase().includes('rejected')) {
        return 'REJECTED';
      }
      if (data.toLocaleLowerCase().includes('archived')) {
        return 'ARCHIVED';
      }
      if (data.toLocaleLowerCase().includes('obsolete')) {
        return 'OBSOLETE';
      }
      if (data.toLocaleLowerCase().includes('submission')) {
        return 'FS';
      }
    }

    return 'DEFAULT';
  }

  getStatusValue(data: string): string {
    if (data !== undefined) {
      if (data.toLocaleLowerCase().includes('accepted')) {
        return 'ACCEPTED';
      }
      if (data.toLocaleLowerCase().includes('rfc')) {
        return 'RFC';
      }
      if (data.toLocaleLowerCase().includes('rejected')) {
        return 'REJECTED';
      }
      if (data.toLocaleLowerCase().includes('archived')) {
        return 'ARCHIVED';
      }
      if (data.toLocaleLowerCase().includes('obsolete')) {
        return 'OBSOLETE';
      }
      if (data.toLocaleLowerCase().includes('submission')) {
        return 'FORMAL SUBMISSION';
      }
    }

    return data;
  }

  updateSelected(index: string, event: Event): void {
    event.stopPropagation();

    if (this.selected === index) {
      this.selected = '-1';
    } else {
      this.selected = index;
    }
  }

  onMouseOverLeaveArrow(id: any, value: boolean) {
    this.isArrowDownOnMouseOver = value;
    this.currentRowOver = id;
  }
}

export interface DataElement {
  position: number;
  title: string;
  sentenceSummary: string;
  paragraphSummary: string;
  status: string;
  github: string;
  forum: string;
  proposal: string;
}

interface ExpandedItems {
  subproposals: boolean;
  summary: boolean;
}
