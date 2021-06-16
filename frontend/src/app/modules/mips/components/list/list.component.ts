import {ChangeDetectionStrategy, Component, Input, Output, ViewChild, EventEmitter, OnChanges, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MipsService } from '../../services/mips.service';


interface ExpandedItems {
  subproposals: boolean;
  summary: boolean;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListComponent implements OnInit, OnChanges {

  columnsToDisplay = ['pos', 'title', 'summary', 'status', 'link'];
  @Input() dataSource: any;
  @Input() loading = true;
  @Input() loadingPlus = false;
  @Input() moreToLoad = true;
  @Input() paginationTotal;
  expandedElement: DataElement | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selected = '-1';
  @Input() paginatorLength;
  pageEvent: PageEvent;
  @Output() send = new EventEmitter();
  @Output() sendOrder = new EventEmitter<string>();
  timeout: any = null;
  currentSortingColumn: string = '';
  ascOrderSorting: boolean = true;
  sortClicked: boolean = false;
  arrowUp: string = '../../../../../assets/images/up.svg';
  arrowDown: string = '../../../../../assets/images/down.svg';
  arrowUpDark: string = '../../../../../assets/images/up_dark.svg';
  arrowDownDark: string = '../../../../../assets/images/down_dark.svg';
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSourceTable = new MatTableDataSource<any>();
  _expandedItems: ExpandedItems = {
    subproposals: false,
    summary: false
  }

  get expandedItems() {
    return this._expandedItems;
  }

  set expandedItems(value) {
    this._expandedItems = {...value};
  }

  markdown = `## Markdown __rulez__!
---

### Syntax highlight
\`\`\`typescript
const language = 'typescript';
\`\`\`

### Lists
1. Ordered list
2. Another bullet point
  - Unordered list
  - Another unordered bullet point

### Blockquote
> Blockquote to the max`;

  constructor(private router: Router, private mipsService: MipsService,) {}

  ngOnInit() {
    this.dataSourceTable.data = this.dataSource;
  }

  ngOnChanges() {
    this.dataSourceTable.data = this.dataSource;
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

    // return data;
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

    // return data;
  }

  updateSelected(index: string, event: Event): void {
    event.stopPropagation();

    if (this.selected === index) {
      this.selected = '-1';
    } else {
      this.selected = index;
    }
  }

  // handlePageEvent(event: PageEvent): void {
  //   clearTimeout(this.timeout);
  //   const $this = this;
  //   this.timeout = setTimeout(() => {
  //       $this.send.emit(event.pageIndex);
  //   }, 1000);
  // }

  onSendOrder(value: string): void {
    let orderPrefix = '';
    if (this.currentSortingColumn === value) {
      this.ascOrderSorting = !this.ascOrderSorting;
      orderPrefix = this.ascOrderSorting ? '' : '-';
    } else {
      this.ascOrderSorting = true;
      this.currentSortingColumn = value;
    }

    this.sendOrder.emit(orderPrefix + this.transforValue(value));
  }

  transforValue(value: string): string {
    if (value === 'pos') { return 'mip'; }
    if (value === 'title') { return 'title'; }
    if (value === 'summary') { return 'sentenceSummary'; }
    if (value === 'status') { return 'status'; }
  }

  onScroll(): void {
    if (!this.loading && this.moreToLoad) {
      this.send.emit();
    }
  }

  onNavigateToDetails(name) {
    this.router.navigate(["/mips/details/", name]);
  }

  onMouseOverLeaveArrow(id: any, value: boolean) {
    this.isArrowDownOnMouseOver = value;
    this.currentRowOver = id;

  }

  onGetSubproposals(row: any, e: Event) {
    e.stopPropagation();
    let index = this.dataSourceTable.data.findIndex(item => item._id === row._id);
    let nextRow = this.dataSourceTable.data[index + 1];

    if (nextRow && nextRow.proposal === row.mipName) { // hide subproposals children
      this.dataSourceTable.data.splice(index + 1, row.cantSubproposals);
      this.dataSourceTable.data = this.dataSourceTable.data;
      this.dataSourceTable.data[index]["cantSubproposals"] = 0;
    } else { // show subproposals children
      if (index !== -1) {
        this.dataSourceTable.data[index]["loadingSubproposals"] = true;
        let filter = {
          equals: [],
        };
        filter.equals.push({field: 'proposal', value: row.mipName});

        this.mipsService.searchMips(100000 , 0, "mipName", '', filter, 'title proposal mipName filename paragraphSummary sentenceSummary mip status')
        .subscribe(data => {
          this.dataSourceTable.data.splice(index + 1, 0, ...data.items);
          this.dataSourceTable.data = this.dataSourceTable.data;
          this.dataSourceTable.data[index]["cantSubproposals"] = data.items.length;
          this.dataSourceTable.data[index]["loadingSubproposals"] = false;
        }, error => {
          this.dataSourceTable.data[index]["loadingSubproposals"] = false;
          console.log(error);
        } );
      }
    }
  }

  // usefull for stop event click propagation when button for get subproposals is disabled and clicked
  onClickButtonCaptureEvent(e: Event) {
    e.stopPropagation();
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

