import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnChanges,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MipsService } from '../../services/mips.service';
import { map } from 'rxjs/operators';
import { IMip } from '../../types/mip';
import { SearchService } from '../../services/search.service';
import { FilterService } from '../../services/filter.service';
import { Subscription } from 'rxjs';
import { StatusService } from '../../services/status.service';
import { ISubsetDataElement } from '../../types/subset';
import { ComponentMip } from '../../types/component-mip';
const clone = require('rfdc')();

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
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('subproposalExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', overflow: 'hidden' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('525ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {
  columnsToDisplay = ['pos', 'title', 'summary', 'status', 'link'];
  @Input() dataSource: any;
  @Input() loading = true;
  @Input() loadingPlus = false;
  @Input() moreToLoad = true;
  @Input() paginationTotal;
  filter: any;
  search: string;
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
  dataSourceTable = new MatTableDataSource<any>();
  _expandedItems: ExpandedItems = {
    subproposals: true,
    summary: false,
  };

  get expandedItems() {
    return this._expandedItems;
  }

  set expandedItems(value) {
    this._expandedItems = { ...value };
  }

  subproposalsGroup: any;
  columnsToDisplaySubsetChildren = ['title', 'summary', 'status', 'link'];
  expandedElementSubsetChildren: DataElement | null;
  subscriptionSearchService: Subscription;
  subscriptionFilterService: Subscription;

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

  constructor(
    private router: Router,
    private mipsService: MipsService,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private filterService: FilterService,
    private statusService: StatusService
  ) {}

  ngOnInit() {
    this.dataSourceTable.data = this.dataSource;
    this.subscriptionSearchService = this.searchService.search$.subscribe(data => {
      this.search = data;
    });
    this.subscriptionFilterService = this.filterService.filter$.subscribe(data => {
      this.filter = data;
    });
  }

  ngOnChanges() {
    this.dataSourceTable.data = this.dataSource;
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
    if (value === 'pos') {
      return 'mip';
    }
    if (value === 'title') {
      return 'title';
    }
    if (value === 'summary') {
      return 'sentenceSummary';
    }
    if (value === 'status') {
      return 'status';
    }
  }

  onScroll(): void {
    if (!this.loading && this.moreToLoad) {
      this.send.emit();
    }
  }

  onNavigateToDetails(name) {
    this.router.navigate(['/mips/details/', name]);
  }

  onMouseOverLeaveArrow(id: any, value: boolean) {
    this.isArrowDownOnMouseOver = value;
    this.currentRowOver = id;
  }

  onGetSubproposals(row: IMip, e: Event) {
    e.stopPropagation();

    if (row.expanded) {
      row.expanded = false;
    } else {
      let index = this.dataSourceTable.data.findIndex(
        (item) => item._id === row._id
      );
      // show subproposals children
      if (index !== -1) {
        this.dataSourceTable.data[index]['loadingSubproposals'] = true;
        let filter = clone(this.filter);
        filter['equals'] = [];
        filter.equals.push({ field: 'proposal', value: row.mipName });

        this.mipsService
          .searchMips(
            100000,
            0,
            'mipName',
            this.search,
            filter,
            'title proposal mipName filename paragraphSummary sentenceSummary mip status'
          )
          .pipe(
            map((res) => {
              const newItems: any[] = (res.items as [])
                .filter((i: any) => i.mipName)
                .map(this.addSubsetField);
              res.items = newItems;
              return res;
            })
          )
          .subscribe(
            (data) => {
              this.dataSourceTable.data[index]['loadingSubproposals'] = false;
              // sort by subset
              let items: any[] = (data.items as []).sort(function (
                a: any,
                b: any
              ) {
                return +(a.subset as string).split(a.proposal + 'c')[1] <
                  +(b.subset as string).split(b.proposal + 'c')[1]
                  ? -1
                  : 1;
              });

              let subproposalsGroup: any = this.groupBy('subset', items);
              this.sortSubproposalsGroups(subproposalsGroup);
              const subsetRows: ISubsetDataElement[] = [];
              const components: ComponentMip[] = this.dataSourceTable.data[index].components;
              let indexComp: number;
              let componentMipTitle = '';

              for (const key in subproposalsGroup) {
                if (
                  Object.prototype.hasOwnProperty.call(subproposalsGroup, key)
                ) {
                  indexComp = components.findIndex((item) => item.cName === key);
                  if (indexComp !== -1) {
                    componentMipTitle = components[indexComp].cTitle;
                  }
                  subsetRows.push({ subset: key, title: componentMipTitle });
                }
              }

              row.subsetRows = subsetRows;
              row.subproposalsGroup = subproposalsGroup;
              row.expanded = true;
              this.cdr.detectChanges();
            },
            (error) => {
              this.dataSourceTable.data[index]['loadingSubproposals'] = false;
              console.log(error);
            }
          );
      }
    }
  }

  groupBy(field, arr: any[]): any {
    let group: any = arr.reduce((r, a) => {
      r[a[field]] = [...(r[a[field]] || []), a];
      return r;
    }, {});

    return group;
  }

  addSubsetField = (item: any) => {
    let subset: string = (item.mipName as string).split('SP')[0];
    item.subset = subset;
    return item;
  };

  sortSubproposalsGroups(subproposalsGroup: any) {
    for (const key in subproposalsGroup) {
      if (Object.prototype.hasOwnProperty.call(subproposalsGroup, key)) {
        let element: any[] = subproposalsGroup[key];
        subproposalsGroup[key] = this.sortSubproposalGroup(element);
      }
    }
  }

  sortSubproposalGroup(arr: any[]) {
    return arr.sort(function (a: any, b: any) {
      return (a.mipName as string).includes('SP') &&
        a.mipName.split('SP').length > 1
        ? +a.mipName.split('SP')[1] < +b.mipName.split('SP')[1]
          ? -1
          : 1
        : 1;
    });
  }

  // usefull for stop event click propagation when button for get subproposals is disabled and clicked
  onClickButtonCaptureEvent(e: Event) {
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.subscriptionSearchService.unsubscribe();
    this.subscriptionFilterService.unsubscribe();
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

