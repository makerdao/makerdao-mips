import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MipsService } from '../../services/mips.service';
import { OrderService } from '../../services/order.service';
import { QueryParamsListService } from '../../services/query-params-list.service';
import { StatusService } from '../../services/status.service';
import { ComponentMip } from '../../types/component-mip';
import IFilter from '../../types/filter';
import { IMip } from '../../types/mip';
import { IMultipleQueryDataElement } from '../../types/multiple-query-data-item';
import {
  Order,
  OrderDirection,
  OrderField,
  OrderFieldName,
} from '../../types/order';
import { ISubsetDataElement } from '../../types/subset';
const clone = require('rfdc')();

@Component({
  selector: 'app-list-multiple-queries',
  templateUrl: './list-multiple-queries.component.html',
  styleUrls: ['./list-multiple-queries.component.scss'],
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
export class ListMultipleQueriesComponent implements OnInit {
  mipsAux: IMip[] = [];
  dataSourceMultiQueriesRows: IMultipleQueryDataElement[] = [];
  columnsToDisplayMultiQueries = ['queryName'];
  expandedElementMipset: IMultipleQueryDataElement | null;
  isArrowMipsetDownOnMouseOver = false;
  currentMipsetRowOver: any;
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  mipSets: any = {};
  limit = 10;
  page = 0;
  order: string = 'mip';
  search: string = '';
  filter: IFilter;
  filterClone: any;
  loading: boolean = false;
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
  subscriptionOrderService: Subscription;
  @Output() changeOrder = new Subject<{
    orderText: string;
    orderObj: Order;
  }>();
  selected = '-1';
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

  constructor(
    private mipsService: MipsService,
    private statusService: StatusService,
    private orderService: OrderService,
    private queryParamsListService: QueryParamsListService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.order = this.orderService.order.field
      ? OrderDirection[this.orderService.order.direction] +
        OrderField[this.orderService.order.field]
      : 'mip mipName';

    this.currentSortingColumn =
      this.orderService.order.field == OrderFieldName[OrderFieldName.Number]
        ? 'pos'
        : (OrderFieldName[
            this.orderService.order.field
          ] as string)?.toLowerCase();
    this.ascOrderSorting = this.orderService.order.direction == 'ASC';
    this.initialized = true;

    this.subscriptionOrderService = this.orderService.orderObs$.subscribe(
      (data) => {
        if (this.initialized) {
          console.log('heree');

          this.order = this.orderService.order.field
            ? OrderDirection[this.orderService.order.direction] +
              OrderField[this.orderService.order.field]
            : 'mip mipName';
          this.currentSortingColumn =
            this.orderService.order.field ==
            OrderFieldName[OrderFieldName.Number]
              ? 'pos'
              : (OrderFieldName[
                  this.orderService.order.field
                ] as string)?.toLowerCase();
          this.ascOrderSorting = this.orderService.order.direction == 'ASC';

          this.queryRows();
          if (this.dataSourceMultiQueriesRows.length) {
            this.onExpandQuery(this.dataSourceMultiQueriesRows[0]);
          }
        }
      }
    );

    // this.queryRows();
  }

  queryRows() {
    this.dataSourceMultiQueriesRows = [];
    // this.loading = true;
    const queryParams = this.queryParamsListService.queryParams;

    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        const element = queryParams[key];

        if (key.includes('_')) {
          this.dataSourceMultiQueriesRows.push({
            queryName: key,
            query: element,
            expanded: false,
            page: 0,
            mips: [],
            loading: false,
          });
        }
      }
    }

    console.log(
      'this.dataSourceMultiQueriesRows',
      this.dataSourceMultiQueriesRows
    );

    // this.loading = false;
  }

  onSendOrder(value: string): void {
    console.log('onSendOrder');

    // location.search += "name=Humberto";
    // Location.normalizeQueryParams("name=Humberto")

    let orderPrefix = '';
    if (this.ascOrderSorting === true || this.currentSortingColumn !== value) {
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
      this.order =
        OrderDirection[this.orderService.order.direction] +
        OrderField[this.orderService.order.field];

      this.orderService.orderObs.next(order);

      // this.searchTagsMipset();
    } else {
      this.currentSortingColumn = '';
      this.ascOrderSorting = true;

      let order: Order = {
        field: 'Number',
        direction: 'ASC',
      };

      this.orderService.order = order;
      this.changeOrder.next({
        orderText: 'mip mipName',
        orderObj: order,
      });
      this.order =
        OrderDirection[this.orderService.order.direction] +
        OrderField[this.orderService.order.field] +
        ' mipName';

      this.orderService.orderObs.next(order);

      // this.searchTagsMipset();
    }
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
    this.dataSourceMultiQueriesRows.forEach((item) => {
      item.limitAux = 10;
    });
    this.dataSourceMultiQueriesRows.forEach((item) => {
      item.page = 0;
    });
    this.order = text;
    this.expandedElementMipset = null;
  }

  onMouseOverLeaveMipsetArrow(mipset: any, value: boolean) {
    this.isArrowMipsetDownOnMouseOver = value;
    this.currentMipsetRowOver = mipset;
  }

  onExpandQuery(row: IMultipleQueryDataElement) {
    if (row.expanded) {
      row.expanded = false;
      this.resetQueryData(row);
    } else {
      this.searchMips(row);
    }
  }

  searchMips(row: IMultipleQueryDataElement) {
    let filter = clone(this.filterClone);
    if (!row.loading) {
      row.loading = true;
      this.mipsService
        .searchMips(
          this.limit,
          row.page,
          this.order,
          row.query,
          filter,
          'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather components subproposalsCount'
        )
        .pipe(
          map((res) => {
            (res.items as IMip[]).map((item) => {
              item.showArrowExpandChildren = true;
              return item;
            });

            return res;
          })
        )
        .subscribe(
          (data: any) => {
            this.hidingSubproposalsUnderParents(data, row);
            row.expanded = true;
          },
          (error) => {
            if (
              error.error &&
              error.error.error &&
              ((error.error.error as string).includes('Parse error') ||
                (error.error.error as string).includes('Lexical error'))
            ) {
              // this.sintaxError = true;
              // this.errorMessage = 'Syntax error.';
            } else {
              // this.sintaxError = false;
              // this.errorMessage = '';
            }
          }
        );
    }
  }

  async hidingSubproposalsUnderParents(
    data,
    row: IMultipleQueryDataElement
  ): Promise<any> {
    let newData: IMip[] = [];
    const forLoop = async () => {
      for (let index = 0; index < data.items.length; index++) {
        const item: IMip = data.items[index];
        const indexFatherInMips = this.indexFather(item, row.mips);
        const indexFatherInNewData = this.indexFather(item, newData);

        if (
          item.proposal !== '' &&
          indexFatherInMips === -1 &&
          indexFatherInNewData === -1
        ) {
          this.addSubsetField(data.items[index]);
          let res: any = await this.mipsService
            .searchMips(
              1,
              0,
              null,
              null,
              { equals: [{ field: 'mipName', value: item.proposal }] },
              'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather components subproposalsCount'
            )
            .toPromise();
          if (res.items[0]) {
            let parent: IMip = res.items[0];
            parent.expanded = true;
            parent.showArrowExpandChildren = true;
            parent.children = [];
            parent.children.push(item);
            let subproposalsGroup: any = this.groupBy(
              'subset',
              parent.children
            );

            if (this.order === 'mip' || this.order === 'mip mipName') {
              this.sortSubproposalsGroups(subproposalsGroup);
            }

            const subsetRows: ISubsetDataElement[] = [];
            const components: ComponentMip[] = parent.components;
            let indexComp: number;
            let componentMipTitle = '';

            for (const key in subproposalsGroup) {
              if (
                Object.prototype.hasOwnProperty.call(subproposalsGroup, key)
              ) {
                indexComp = components?.findIndex((item) => item.cName === key);
                if (indexComp && indexComp !== -1) {
                  componentMipTitle = components[indexComp].cTitle;
                }
                subsetRows.push({
                  subset: key,
                  expanded: true,
                  title: componentMipTitle,
                });
              }
            }

            parent.subproposalsGroup = subproposalsGroup;
            parent.subsetRows = subsetRows;
            newData.push(parent);
          }
        } else if (item.proposal && indexFatherInNewData !== -1) {
          this.addSubsetField(data.items[index]);
          newData[indexFatherInNewData].children.push(item);

          let subproposalsGroup: any = this.groupBy(
            'subset',
            newData[indexFatherInNewData].children
          );

          if (this.order === 'mip' || this.order === 'mip mipName') {
            this.sortSubproposalsGroups(subproposalsGroup);
          }

          const subsetRows: ISubsetDataElement[] = [];
          const components: ComponentMip[] =
            newData[indexFatherInNewData].components;
          let indexComp: number;
          let componentMipTitle = '';

          for (const key in subproposalsGroup) {
            if (Object.prototype.hasOwnProperty.call(subproposalsGroup, key)) {
              indexComp = components?.findIndex((item) => item.cName === key);
              if (indexComp && indexComp !== -1) {
                componentMipTitle = components[indexComp].cTitle;
              }
              subsetRows.push({
                subset: key,
                expanded: true,
                title: componentMipTitle,
              });
            }
          }

          newData[indexFatherInNewData].subproposalsGroup = subproposalsGroup;
          newData[indexFatherInNewData].subsetRows = subsetRows;
          newData[indexFatherInNewData].expanded = true;
          newData[indexFatherInNewData].showArrowExpandChildren = true;
        } else if (item.proposal && indexFatherInMips !== -1) {
          this.addSubsetField(data.items[index]);
          row.mips[indexFatherInMips].expanded = true;
          row.mips[indexFatherInMips].showArrowExpandChildren = true;
          row.mips[indexFatherInMips].children.push(item);

          let subproposalsGroup: any = this.groupBy(
            'subset',
            row.mips[indexFatherInMips].children
          );

          if (this.order === 'mip' || this.order === 'mip mipName') {
            this.sortSubproposalsGroups(subproposalsGroup);
          }

          const subsetRows: ISubsetDataElement[] = [];
          const components: ComponentMip[] =
            row.mips[indexFatherInMips].components;
          let indexComp: number;
          let componentMipTitle = '';

          for (const key in subproposalsGroup) {
            if (Object.prototype.hasOwnProperty.call(subproposalsGroup, key)) {
              indexComp = components?.findIndex((item) => item.cName === key);
              if (indexComp && indexComp !== -1) {
                componentMipTitle = components[indexComp].cTitle;
              }
              subsetRows.push({
                subset: key,
                expanded: true,
                title: componentMipTitle,
              });
            }
          }

          row.mips[indexFatherInMips].subproposalsGroup = subproposalsGroup;
          row.mips[indexFatherInMips].subsetRows = subsetRows;
          row.mips[indexFatherInMips].expanded = true;
        } else if (!item.proposal) {
          const indexItemInLoadedMips = this.indexItemInLoadedMips(
            item,
            row.mips
          );
          const indexItemInLoadedNewdata = this.indexItemInLoadedMips(
            item,
            newData
          );

          if (indexItemInLoadedMips === -1 && indexItemInLoadedNewdata === -1) {
            item.expanded = false;
            item.children = [];
            item.showArrowExpandChildren = false;
            newData.push(item);
          }
        }
      }
    };

    await forLoop();
    this.mipsAux = newData;
    row.mips = row.mips.concat(this.mipsAux);
    row.total = data.total;
    row.loading = false;

    if (row.limitAux >= row.total) {
      row.moreToLoad = false;
    } else {
      row.moreToLoad = true;
    }
    this.cdr.detectChanges();
  }

  indexFather(mip: IMip, mips: IMip[]) {
    return mips.findIndex((item) => mip.proposal === item.mipName);
  }

  indexItemInLoadedMips(mip: IMip, mips: IMip[]) {
    return mips.findIndex((item) => mip.mipName === item.mipName);
  }

  addSubsetField = (item: any) => {
    let subset: string = (item.mipName as string).split('SP')[0];
    item.subset = subset;
    return item;
  };

  groupBy(field, arr: any[]): any {
    let group: any = arr.reduce((r, a) => {
      r[a[field]] = [...(r[a[field]] || []), a];
      return r;
    }, {});

    return group;
  }

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

  onSendPagination(row: IMultipleQueryDataElement): void {
    row.page++;
    row.limitAux += 10;
    if (row.moreToLoad) {
      this.searchMips(row);
    }
  }

  resetQueryData(row: IMultipleQueryDataElement) {
    row.mips = [];
    row.page = 0;
    row.limitAux = 10;
    row.loading = false;
    row.moreToLoad = false;
    row.total = 0;
  }
}

interface ExpandedItems {
  subproposals: boolean;
  summary: boolean;
}
