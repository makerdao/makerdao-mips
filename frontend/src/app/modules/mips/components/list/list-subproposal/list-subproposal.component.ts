import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { StatusService } from '../../../services/status.service';

@Component({
  selector: 'app-list-subproposal',
  templateUrl: './list-subproposal.component.html',
  styleUrls: ['./list-subproposal.component.scss'],
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
export class ListSubproposalComponent implements OnInit {
  @Input() subsetChildrenActivate: boolean = true;
  @Input() dataSource: any;
  @Input() darkMode:boolean=false;
  columnsToDisplaySubsetChildren = ['pos', 'title', 'summary', 'status', 'link'];
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

  constructor(private router: Router, private statusService: StatusService) {

    console.log({darkMode:this.darkMode})
  }

  ngOnInit(): void {}

  onNavigateToDetails(name) {
    this.router.navigate(['/mips/details/', name]);
  }

  getStatusValue(data: string): string {
    return this.statusService.getStatusValue(data);
  }

  getStatusType(data: string): string {
    return this.statusService.getStatusType(data);
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
