import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterService } from '../../services/filter.service';
import { MipsService } from '../../services/mips.service';
import { OrderService } from '../../services/order.service';
import { SearchService } from '../../services/search.service';
import { SmartSearchService } from '../../services/smart-search.service';
import { StatusService } from '../../services/status.service';
import IFilter from '../../types/filter';
import { IMIPsetDataElement } from '../../types/mipset';
import {
  Order,
  OrderDirection,
  OrderField,
  OrderFieldName,
} from '../../types/order';
const clone = require('rfdc')();

@Component({
  selector: 'app-list-mipset-mode',
  templateUrl: './list-mipset-mode.component.html',
  styleUrls: ['./list-mipset-mode.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('mipsetExpand', [
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
export class ListMipsetModeComponent implements OnInit, OnDestroy {
  dataSourceMipsetRows: IMIPsetDataElement[] = [];
  columnsToDisplayMipset = ['mipset'];
  expandedElementMipset: IMIPsetDataElement | null;
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  mipSets: any = {};
  limit = 10;
  limitAux = 10;
  page = 0;
  order: string = 'mip';
  search: string = '';
  filter: IFilter;
  filterClone: any;
  loading: boolean = false;
  total: number;
  columnsToDisplay = ['pos', 'title', 'summary', 'status', 'link'];
  currentSortingColumn: string = '';
  ascOrderSorting: boolean = true;
  arrowUp: string = '../../../../../assets/images/up.svg';
  arrowDown: string = '../../../../../assets/images/down.svg';
  arrowUpDark: string = '../../../../../assets/images/up_dark.svg';
  arrowDownDark: string = '../../../../../assets/images/down_dark.svg';
  initialized: boolean = false;
  subscriptionSearchService: Subscription;
  subscriptionFilterService: Subscription;
  @Output() changeOrder = new Subject<{
    orderText: string;
    orderObj: Order;
  }>();

  constructor(
    private smartSearchService: SmartSearchService,
    private mipsService: MipsService,
    private searchService: SearchService,
    private filterService: FilterService,
    private statusService: StatusService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.order =
      OrderDirection[this.orderService.order.direction] +
      OrderField[this.orderService.order.field];
    this.currentSortingColumn =
      this.orderService.order.field == OrderFieldName[OrderFieldName.Number]
        ? 'pos'
        : (OrderFieldName[
            this.orderService.order.field
          ] as string)?.toLowerCase();
    this.ascOrderSorting = this.orderService.order.direction == 'ASC';
    this.initialized = true;
    this.subscriptionSearchService = this.searchService.search$.subscribe(
      (data) => {
        this.search = data;
        this.searchTagsMipset();
      }
    );
    this.subscriptionFilterService = this.filterService.filter$.subscribe(
      (data) => {
        this.filter = data;
        this.filterClone = clone(this.filter);
        let index = this.filterClone.equals.findIndex(
          (item) => item.field === 'proposal'
        );
        this.filterClone.equals.splice(index, 1); // include subproposals in searching
        this.searchTagsMipset();
      }
    );
  }

  searchTagsMipset() {
    this.loading = true;
    this.smartSearchService
      .getOptions('tags', '')
      .pipe(
        map((tags: any[]) => {
          let modifiedTags: any[] = tags
            .filter((item: any) => (item.tag as string).endsWith('-mipset'))
            .map((i) => {
              return {
                mipset: i.tag,
              };
            })
            .sort((a: any, b: any) => (a.mipset < b.mipset ? -1 : 1));

          return modifiedTags;
        })
      )
      .subscribe(
        async (data: any[]) => {
          let promises = await data.map((item) =>
            this.getAtLeastOneElementByTag(item.mipset)
          );
          let mips: any[] = await Promise.all(promises);
          this.dataSourceMipsetRows = data.filter((_, index) => {
            return mips[index].items && mips[index].items.length > 0;
          });

          this.dataSourceMipsetRows.forEach((item: IMIPsetDataElement) => {
            this.mipSets[item.mipset] = [];
            item.expanded = false;
          });

          if (this.dataSourceMipsetRows.length > 0) {
            await this.expandFirstMipset(this.dataSourceMipsetRows[0]);
          }

          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onMouseOverLeaveMipsetArrow(mipset: any, value: boolean) {
    this.isArrowDownOnMouseOver = value;
    this.currentRowOver = mipset;
  }

  onExpandMipset(row: IMIPsetDataElement) {
    if (row.expanded) {
      row.expanded = false;
    } else {
      let filter = clone(this.filterClone);
      filter.contains.push({ field: 'tags', value: row.mipset });
      this.mipsService
        .searchMips(
          this.limit,
          this.page,
          this.order,
          this.search,
          filter,
          'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather'
        )
        .subscribe(
          (data) => {
            this.mipSets[row.mipset] = data.items;
            row.expanded = true;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  async expandFirstMipset(row: IMIPsetDataElement) {
    try {
      let filter = clone(this.filterClone);
      filter.contains.push({ field: 'tags', value: row.mipset });

      let data: any = await this.mipsService
        .searchMips(
          this.limit,
          this.page,
          this.order,
          this.search,
          filter,
          'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather'
        )
        .toPromise();
      this.mipSets[row.mipset] = data.items;
      row.expanded = true;

      return;
    } catch (error) {
      console.log(error);
    }
  }

  deleteFilterInarray(array: Array<any>, data: any) {
    let index = array.findIndex(
      (i) => i.field === data.field && i.value === data.value
    );

    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  onSendOrder(value: string): void {
    let orderPrefix = '';
    if (this.currentSortingColumn === value) {
      this.ascOrderSorting = !this.ascOrderSorting;
      orderPrefix = this.ascOrderSorting ? '' : '-';
    } else {
      this.ascOrderSorting = true;
      this.currentSortingColumn = value;
    }

    this.setOrder(orderPrefix + this.transforValue(value));

    let order: Order = {
      field:
        this.currentSortingColumn == 'pos'
          ? 'Number'
          : this.toOrderBy(this.currentSortingColumn),
      direction: this.ascOrderSorting ? 'ASC' : 'DESC',
    };

    this.orderService.order = order;

    this.changeOrder.next({
      orderText: orderPrefix + this.transforValue(value),
      orderObj: order,
    });

    this.searchTagsMipset();
  }

  toOrderBy(value: string): string {
    let orderBy: string;

    switch (value) {
      case 'pos':
        orderBy = OrderFieldName.Number;
        break;
      case 'title':
        orderBy = OrderFieldName.Title;
        break;
      case 'summary':
        orderBy = OrderFieldName.Summary;
        break;
      case 'status':
        orderBy = OrderFieldName.Status;
        break;
      case 'mostUsed':
        orderBy = OrderFieldName.MostUsed;
        break;

      default:
        break;
    }

    return orderBy;
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

  setOrder(text: string): void {
    this.limitAux = 10;
    this.page = 0;
    this.order = text;
    this.expandedElementMipset = null;
  }

  getAtLeastOneElementByTag(tag: string): Promise<any> {
    let filter = clone(this.filterClone);
    filter.contains.push({ field: 'tags', value: tag });
    return this.mipsService
      .searchMips(1, 0, this.order, this.search, filter, 'title mipName')
      .toPromise();
  }

  getStatusValue(data: string): string {
    return this.statusService.getStatusValue(data);
  }

  getStatusType(data: string): string {
    return this.statusService.getStatusType(data);
  }

  getOrderDirection(column: string) {
    let orderDirection =
      this.currentSortingColumn === column && this.ascOrderSorting
        ? 1
        : this.currentSortingColumn === column && !this.ascOrderSorting
        ? -1
        : 0;

    return orderDirection;
  }

  ngOnDestroy() {
    this.subscriptionSearchService.unsubscribe();
    this.subscriptionFilterService.unsubscribe();
  }
}
