import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import { FilterService } from '../../services/filter.service';
import { MipsService } from '../../services/mips.service';
import { OrderService } from '../../services/order.service';
import { SearchService } from '../../services/search.service';
import { StatusService } from '../../services/status.service';
import { ComponentMip } from '../../types/component-mip';
import { IMip } from '../../types/mip';
import { OrderDirection, OrderField } from '../../types/order';
import { ISubsetDataElement } from '../../types/subset';
const clone = require('rfdc')();

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
export class SublistComponent implements OnInit, OnChanges {
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
  dataSourceTable = new MatTableDataSource<any>();
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
  filter: any;
  search: string;
  subscriptionSearchService: Subscription;
  subscriptionFilterService: Subscription;

  constructor(
    private router: Router,
    private statusService: StatusService,
    private orderService: OrderService,
    private mipsService: MipsService,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    public darkModeService: DarkModeService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.subscriptionSearchService = this.searchService.search$.subscribe(
      (data) => {
        this.search = data;
      }
    );
    this.subscriptionFilterService = this.filterService.filter$.subscribe(
      (data) => {
        this.filter = data;
      }
    );
  }

  ngOnChanges() {
    this.dataSourceTable.data = this.dataSource;
  }

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
        let order: string;

        if (
          this.orderService.order.field &&
          this.orderService.order.direction
        ) {
          order =
            OrderDirection[this.orderService.order.direction] +
            OrderField[this.orderService.order.field];
        } else {
          order = 'mipName';
        }

        this.mipsService
          .searchMips(
            100000,
            0,
            // 'mipName',
            order,
            row.showArrowExpandChildren ? this.search : '',
            filter,
            'title proposal mipName filename paragraphSummary sentenceSummary mip status  forumLink votingPortalLink'
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
              let items: any[] = data.items;
              let subproposalsGroup: any = this.groupBy('subset', items);

              if (!order || order === 'mip' || order === 'mipName') {
                this.sortSubproposalsGroups(subproposalsGroup);
              }

              const subsetRows: ISubsetDataElement[] = [];
              const components: ComponentMip[] = this.dataSourceTable.data[
                index
              ].components;
              let indexComp: number;
              let componentMipTitle = '';

              for (const key in subproposalsGroup) {
                if (
                  Object.prototype.hasOwnProperty.call(subproposalsGroup, key)
                ) {
                  indexComp = components.findIndex(
                    (item) => item.cName === key
                  );
                  if (indexComp !== -1) {
                    componentMipTitle = components[indexComp].cTitle;
                  }
                  subsetRows.push({ subset: key, title: componentMipTitle });
                }
              }

              let subsetSortedRows: any[] = (subsetRows as []).sort(function (
                a: any,
                b: any
              ) {
                return +(a.subset as string).split('c')[1] <
                  +(b.subset as string).split('c')[1]
                  ? -1
                  : 1;
              });

              row.subsetRows = subsetSortedRows;
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
    let subset: string = (item.mipName as string)?.split('SP')[0];
    item.subset = subset;

    // this conditional is only to fix some css issue
    if (!item.sentenceSummary) {
      item.sentenceSummary = '<p style="width:150px;"></p>'; // this is just to allow the arrow of the align the sentence summary with others arrows
    }

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
    this.subscriptionFilterService.unsubscribe();
    this.subscriptionSearchService.unsubscribe();
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
