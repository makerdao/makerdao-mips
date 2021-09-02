import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import FilterData from '../../components/filter/filter.data';
import { MipsService } from '../../services/mips.service';
import { FooterVisibleService } from '../../../../services/footer-visible/footer-visible.service';
import { FilterListComponent } from '../../components/filter-list/filter-list.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FilterItemService } from 'src/app/services/filter-item/filter-item.service';
import { QueryParamsListService } from '../../services/query-params-list.service';
import QueryParams from '../../types/query-params';
import { ElementsRefUiService } from '../../../../services/elements-ref-ui/elements-ref-ui.service';
import { fromEvent, Subscription } from 'rxjs';
import { MetadataShareService } from '../../services/metadata-share.service';
import { IMip } from '../../types/mip';
import { map } from 'rxjs/operators';
import { OrderDirection, OrderField } from '../../types/order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
})
export class ListPageComponent implements OnInit, AfterViewInit {
  mips: IMip[] = [];
  mipsAux: IMip[] = [];
  limit = 10;
  limitAux = 10;
  page = 0;
  order: string;
  search: string = '';
  searchCopy: string = '';
  filter: any;
  filterSaved: FilterData;
  loading: boolean = false;
  loadingPlus: boolean;
  total: number;
  moreToLoad: boolean;
  mobileSearch = false;
  @ViewChild('filterList', { static: true }) filterList: FilterListComponent;
  showFilterList: boolean = false;
  showListSearch: boolean = false;
  listSearchMip: any[] = [];
  mipsByName: any[] = [];
  sintaxError: boolean = false;
  errorMessage: string = '';
  defaultSearch: string = '$ and(not(@Obsolete), not(@Withdrawn))';
  mobileView: boolean = false;
  mipsetMode: boolean = false;
  activeMenuLinkName = '';
  initActiveLinkName = 'MIPs List';
  limitMipsSuggestions = 10;
  pageMipsSuggestions = 0;
  loadingMipsSuggestions = false;
  subscriptionLoadSuggestions = new Subscription();
  totalMipsSuggestion = 0;
  searchSuggestions = false;

  constructor(
    private mipsService: MipsService,
    private footerVisibleService: FooterVisibleService,
    private router: Router,
    private filterItemService: FilterItemService,
    private route: ActivatedRoute,
    private queryParamsListService: QueryParamsListService,
    private elementsRefUiService: ElementsRefUiService,
    private metadataShareService: MetadataShareService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.order = 'mip';
    this.initParametersToLoadData();
    this.searchMips();

    this.footerVisibleService.isFooterVisible$.subscribe((data) => {
      let elementFeedback = document.getElementById('feedback');
      if (data === true && elementFeedback) {
        elementFeedback.style.position = 'relative';
        elementFeedback.style.bottom =
          window.innerWidth >= 500 ? '0px' : '-10px';
      } else {
        if (elementFeedback) {
          elementFeedback.style.position = 'fixed';
          elementFeedback.style.bottom = '40px';
        }
      }
    });

    this.queryParamsListService.qParams$.subscribe((data: QueryParams) => {
      this.updateUrlQueryParams(data);
    });

    this.orderService.order$.subscribe((order) => {
      console.log("order change subscription");
      this.order = order.direction + order.field;
      this.onSendOrder(order.direction + order.field);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initFiltersList();

      if (window.innerWidth <= 768) {
        this.mobileView = true;
      } else {
        this.mobileView = false;
      }

      fromEvent(window, 'onresize').subscribe(() => {
        if (window.innerWidth <= 768) {
          this.mobileView = true;
        } else {
          this.mobileView = false;
        }
      });
    }, 200);

    this.metadataShareService.title = 'MIPs Portal';
    this.metadataShareService.description =
      'Maker Improvement Proposals are the preferred mechanism for improving both Maker Governance and the Maker Protocol.';
  }

  initParametersToLoadData() {
    this.initQueryParams();
    this.initFiltersAndSearch();
    this.initMipsetMode();
    this.initOrderBy();
    this.mips = [];
    this.limitAux = 10;
    this.page = 0;
  }

  initQueryParams() {
    let queryParams: any = this.route.snapshot.queryParamMap;
    let status;

    if (queryParams.has('status')) {
      if (typeof queryParams.params.status === 'string') {
        (status = []).push(queryParams.params.status);
      } else {
        status = [...queryParams.params.status];
      }
    }

    let qp: QueryParams = {
      ...queryParams.params,
      status: status ? status : null,
      search: queryParams.params.search ? queryParams.params.search : null,
      contributor: queryParams.params.contributor,
      author: queryParams.params.author,
      mipsetMode: JSON.parse(queryParams.params.mipsetMode || null),
      customViewName: queryParams.params.customviewname,
      orderBy: OrderField[(queryParams.params.orderBy as string)?.toLowerCase()],
    };

    this.queryParamsListService.queryParams = qp;

    this.searchCopy = this.defaultSearch;
    this.activeMenuLinkName =
      queryParams.params.customviewname || this.initActiveLinkName;

    for (const key in qp) {
      if (Object.prototype.hasOwnProperty.call(qp, key)) {
        const element = qp[key];

        if (element && (element as [])?.length != 0) {
          this.searchCopy = this.search;
          break;
        }
      }
    }
  }

  initFiltersAndSearch() {
    this.filter = {
      contains: [],
      notcontains: [],
      equals: [],
      notequals: [],
      inarray: [],
    };
    this.initFiltersStatus();
    this.initFilterContributor();
    this.initFilterAuthor();
    this.initSearch();
  }

  initSearch() {
    let queryParams: QueryParams = this.queryParamsListService.queryParams;
    this.search = queryParams.search;
  }

  initOrderBy() {
    let queryParams: QueryParams = this.queryParamsListService.queryParams;
    this.order = queryParams.orderBy;
    this.orderService.order.next({
      field: queryParams.orderBy,
      direction: OrderDirection.ASC,
    });
    // this.orderService.order$.subscribe((order) => {
    //   console.log("order change subscription");
    //   this.order = order.direction + order.field;
    // });
  }

  initFilterContributor() {
    if (this.queryParamsListService.queryParams.contributor) {
      this.pushFilterInarray(this.filter.inarray, {
        field: 'contributors',
        value: this.queryParamsListService.queryParams.contributor,
      });
    }
  }

  initFilterAuthor() {
    if (this.queryParamsListService.queryParams.author) {
      this.pushFilterInarray(this.filter.inarray, {
        field: 'author',
        value: this.queryParamsListService.queryParams.author,
      });
    }
  }

  initMipsetMode() {
    this.mipsetMode = this.queryParamsListService.queryParams.mipsetMode;
  }

  initFiltersStatus() {
    if (this.queryParamsListService.queryParams.status) {
      this.queryParamsListService.queryParams.status.forEach((value) => {
        switch (value) {
          case 'Accepted':
            this.mipsService.setFilterArrayStatus(0, 1);
            break;
          case 'Rejected':
            this.mipsService.setFilterArrayStatus(1, 1);
            break;
          case 'Archive':
            this.mipsService.setFilterArrayStatus(2, 1);
            break;
          case 'RFC':
            this.mipsService.setFilterArrayStatus(3, 1);
            break;
          case 'Obsolete':
            this.mipsService.setFilterArrayStatus(4, 1);
            break;
          case 'Formal Submission':
            this.mipsService.setFilterArrayStatus(5, 1);
            break;
          default:
            break;
        }
      });
    }

    this.filter.notequals.push({ field: 'mip', value: -1 });

    this.setFiltersStatus();
  }

  setFiltersStatus() {
    let filter = { ...this.filter };

    this.filterSaved = this.mipsService.getFilter();

    if (this.filterSaved.arrayStatus[0] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Accepted',
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Accepted',
      });
    }
    if (this.filterSaved.arrayStatus[1] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Rejected',
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Rejected',
      });
    }
    if (this.filterSaved.arrayStatus[2] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Archive',
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Archive',
      });
    }
    if (this.filterSaved.arrayStatus[3] === 1) {
      this.pushFilterInarray(filter.inarray, { field: 'status', value: 'RFC' });
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Request for Comments (RFC)',
      });
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Request for Comments',
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'RFC',
      });
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Request for Comments (RFC)',
      });
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Request for Comments',
      });
    }
    if (this.filterSaved.arrayStatus[4] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Obsolete',
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Obsolete',
      });
    }
    if (this.filterSaved.arrayStatus[5] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Formal Submission',
      });
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Formal Submission (FS)',
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Formal Submission',
      });
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: 'Formal Submission (FS)',
      });
    }

    this.filter = { ...filter };
  }

  pushFilterInarray(array: Array<any>, data: any) {
    let item = array.find(
      (i) => i.field === data.field && i.value === data.value
    );

    if (!item) {
      array.push(data);
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

  searchMips(): void {
    let index = this.filter.equals.findIndex(
      (item) => item.field === 'proposal'
    );

    if (this.filterOrSearch()) {
      // filter or search
      if (index !== -1) {
        this.filter.equals.splice(index, 1); // include subproposals in searching
      }
    } else {
      if (index === -1) {
        this.filter.equals.push({ field: 'proposal', value: '' }); // no subproposals
      }
    }

    this.searchCopy = this.defaultSearch;

    if (this.filterOrSearch()) {
      this.searchCopy = this.search;
    }

    if (!this.loading) {
      this.loading = true;
      this.mipsService
        .searchMips(
          this.limit,
          this.page,
          this.filterOrSearch() &&
            !this.queryParamsListService.queryParams.orderBy
            ? 'mip mipName'
            : this.order,
          this.searchCopy,
          this.filter,
          'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather'
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
            if (this.filterOrSearch()) {
              this.hidingSubproposalsUnderParents(data);
            } else {
              this.mipsAux = data.items;
              this.mips = this.mips.concat(this.mipsAux);
              this.total = data.total;
              this.loading = false;
              this.loadingPlus = false;

              if (this.limitAux >= this.total) {
                this.moreToLoad = false;
              } else {
                this.moreToLoad = true;
              }
            }

            this.sintaxError = false;
            this.errorMessage = '';

            if (
              this.elementsRefUiService.containerRef.nativeElement.getBoundingClientRect()
                .height <= window.innerHeight
            ) {
              this.onSendPagination();
            }
          },
          (error) => {
            if (
              error.error &&
              error.error.error &&
              ((error.error.error as string).includes('Parse error') ||
                (error.error.error as string).includes('Lexical error'))
            ) {
              this.sintaxError = true;
              this.errorMessage = 'Syntax error.';
            } else {
              this.sintaxError = false;
              this.errorMessage = '';
            }
          }
        );
    }
  }

  async hidingSubproposalsUnderParents(data): Promise<any> {
    let newData: IMip[] = [];
    const forLoop = async () => {
      for (let index = 0; index < data.items.length; index++) {
        const item: IMip = data.items[index];
        if (
          item.proposal !== '' &&
          item.proposal !== this.mips[this.mips.length - 1]?.mipName &&
          item.proposal !== newData[newData.length - 1]?.mipName
        ) {
          let stop: boolean = false;
          let j = index + 1;

          // search subproposals with same MIP father
          for (j; j < data.items.length && !stop; j++) {
            const element: IMip = data.items[j];

            if (!element.proposal || element.proposal !== item.proposal) {
              stop = true;
            }

            this.addSubsetField(data.items[j - 1]);
          }

          let res: any = await this.mipsService
            .searchMips(
              1,
              0,
              null,
              null,
              { equals: [{ field: 'mipName', value: item.proposal }] },
              'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather'
            )
            .toPromise();
          let parent: IMip = res.items[0];
          parent.expanded = true;
          parent.showArrowExpandChildren = true;
          let top: number = stop ? j - 1 : j;
          parent.children = (data.items as []).slice(index, top);

          if (!stop && j === data.items.length) {
            index = j;
            this.addSubsetField(data.items[j - 1]);
          } else {
            index = j - 2;
          }

          let subproposalsGroup: any = this.groupBy('subset', parent.children);
          this.sortSubproposalsGroups(subproposalsGroup);
          const subsetRows: any[] = [];

          for (const key in subproposalsGroup) {
            if (Object.prototype.hasOwnProperty.call(subproposalsGroup, key)) {
              subsetRows.push({ subset: key, expanded: true });
            }
          }

          parent.subproposalsGroup = subproposalsGroup;
          parent.subsetRows = subsetRows;
          newData.push(parent);
        } else if (item.proposal) {
          this.addSubsetField(data.items[index]);
          let stop: boolean = false;
          let j = index + 1;

          // search subproposals with same MIP father
          for (j; j < data.items.length && !stop; j++) {
            const element: IMip = data.items[j];

            if (
              !element.proposal ||
              element.proposal !== newData[newData.length - 1]?.mipName
            ) {
              stop = true;
            } else {
              this.addSubsetField(data.items[j]);
            }
          }

          if (newData.length > 0) {
            newData[newData.length - 1].expanded = true;
            let top: number = stop ? j - 1 : j;
            newData[newData.length - 1].children = (data.items as []).slice(
              index,
              top
            );

            if (!stop && j === data.items.length) {
              index = j;
            } else {
              index = j - 2;
            }

            let subproposalsGroup: any = this.groupBy(
              'subset',
              newData[newData.length - 1].children
            );
            this.sortSubproposalsGroups(subproposalsGroup);
            const subsetRows: any[] = [];

            for (const key in subproposalsGroup) {
              if (
                Object.prototype.hasOwnProperty.call(subproposalsGroup, key)
              ) {
                subsetRows.push({ subset: key, expanded: true });
              }
            }

            newData[newData.length - 1].subproposalsGroup = subproposalsGroup;
            newData[newData.length - 1].subsetRows = subsetRows;
            newData[newData.length - 1].expanded = true;
            newData[newData.length - 1].showArrowExpandChildren = true;
          } else {
            this.mips[this.mips.length - 1].expanded = true;
            this.mips[this.mips.length - 1].showArrowExpandChildren = true;
            let top: number = stop ? j - 1 : j;
            this.mips[this.mips.length - 1].children = this.mips[
              this.mips.length - 1
            ].children.concat((data.items as []).slice(index, top));

            if (!stop && j === data.items.length) {
              index = j;
            } else {
              index = j - 2;
            }

            let subproposalsGroup: any = this.groupBy(
              'subset',
              this.mips[this.mips.length - 1].children
            );
            this.sortSubproposalsGroups(subproposalsGroup);
            const subsetRows: any[] = [];

            for (const key in subproposalsGroup) {
              if (
                Object.prototype.hasOwnProperty.call(subproposalsGroup, key)
              ) {
                subsetRows.push({ subset: key, expanded: true });
              }
            }

            this.mips[
              this.mips.length - 1
            ].subproposalsGroup = subproposalsGroup;
            this.mips[this.mips.length - 1].subsetRows = subsetRows;
            this.mips[this.mips.length - 1].expanded = true;
          }
        } else {
          item.expanded = false;
          item.children = [];
          item.showArrowExpandChildren = false;
          newData.push(item);
        }
      }
    };

    await forLoop();
    this.mipsAux = newData;
    this.mips = this.mips.concat(this.mipsAux);
    this.total = data.total;
    this.loading = false;
    this.loadingPlus = false;

    if (this.limitAux >= this.total) {
      this.moreToLoad = false;
    } else {
      this.moreToLoad = true;
    }
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

  filterOrSearch(): boolean {
    if (
      this.filter.contains.length ||
      this.filter.inarray.length ||
      this.filter.notcontains.length ||
      this.search
    ) {
      return true;
    }

    return false;
  }

  searchMipsByName(limit, page, order, search, filter): void {
    this.loadingMipsSuggestions = true;
    this.loading = true;
    this.subscriptionLoadSuggestions = this.mipsService
      .searchMips(
        limit,
        page,
        order,
        search,
        filter,
        'title proposal mipName filename paragraphSummary sentenceSummary mip status mipFather'
      )
      .subscribe(
        (data) => {
          this.mipsByName = data.items;

          this.showListSearch = true;
          let items: any[] = this.mipsByName.map((item) => {
            const cleanedTitle = item.title.replace(/[^\w]*/g, '');
            const cleanedMipName = item.mipName.replace(/[^\w]*/g, '');

            const titleContainsMipsName = cleanedTitle.includes(cleanedMipName);

            return {
              content:
                (titleContainsMipsName ? '' : item.mipName) +
                ' ' +
                (item.title !== undefined ? item.title : ''),
              mipName: item.mipName,
              id: item._id,
            };
          });

          this.listSearchMip = this.listSearchMip.concat(items);
          this.loadingMipsSuggestions = false;
          this.totalMipsSuggestion = data.total;
          this.total = data.total;
          this.hidingSubproposalsUnderParents(data);
          this.loading = false;

          if (this.limitAux >= this.total) {
            this.moreToLoad = false;
          } else {
            this.moreToLoad = true;
          }
        },
        (err) => {
          this.loadingMipsSuggestions = false;
          this.loading = false;
          console.log(err);
        }
      );
  }

  onSendPagination(): void {
    if (this.searchSuggestions) {
      if (this.moreToLoad && !this.loading) {
        // while is loading we don't request for more items in order to be sure that items are displayed  in the same oreder they are requested
        this.onLoadMoreMipsSuggestions();
      }
    } else {
      this.loadingPlus = true;
      this.page++;
      this.limitAux += 10;
      if (this.moreToLoad) {
        this.searchMips();
      }
    }
  }

  onSendFilters() {
    this.setFiltersStatus();
    this.mips = [];
    this.limitAux = 10;
    this.page = 0;
    this.searchMips();
    this.setQueryParams();
  }

  onSendSearch(event: any): void {
    let search = event.target.value.toLowerCase().trim();
    this.search = event.target.value;

    if (search.startsWith('mip')) {
      if (event.keyCode == 13 && this.listSearchMip.length > 0) {
        this.goToMipDetails(this.listSearchMip[0].mipName);
      } else {
        this.searchSuggestions = true;
        this.pageMipsSuggestions = 0;
        this.listSearchMip = [];
        this.limitAux = 10;
        this.mips = [];
        let filter = {
          contains: [],
        };
        filter.contains.push({ field: 'mipName', value: event.target.value });
        this.subscriptionLoadSuggestions.unsubscribe();
        this.searchMipsByName(
          this.limitMipsSuggestions,
          this.pageMipsSuggestions,
          'mip mipName',
          '',
          filter
        );
        this.limit = 0;
      }
    } else {
      this.searchSuggestions = false;
      this.showListSearch = false;
      this.listSearchMip = [];
      this.limitAux = 10;
      this.mips = [];
      this.page = 0;
      this.search = event.target.value;
      this.searchMips();
      this.setQueryParams();
    }
  }

  onLoadMoreMipsSuggestions() {
    if (this.listSearchMip.length < this.totalMipsSuggestion) {
      this.pageMipsSuggestions++;
      this.limitAux += 10;
      let filter = {
        contains: [],
      };
      filter.contains.push({ field: 'mipName', value: this.search });
      this.searchMipsByName(
        this.limitMipsSuggestions,
        this.pageMipsSuggestions,
        'mip mipName',
        '',
        filter
      );
    }
  }

  onSendOrder(text: string): void {
    console.log("order", text);

    this.mips = [];
    this.limitAux = 10;
    this.page = 0;
    this.order = text;
    this.searchMips();
  }

  onOpenMobileSearch(open: boolean): void {
    this.mobileSearch = open;
  }

  cmpFn(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }

  onCloseFilterItem(event) {
    this.mipsService.setFilterArrayStatus(parseInt(event), 0);
    this.setFiltersStatus();
    this.onSendFilters();
  }

  onHasItemsFilterList(event) {
    this.showFilterList = event;
  }

  onNavigateToMipDetails(event) {
    this.goToMipDetails(event.mipName);
  }

  goToMipDetails(name) {
    this.router.navigate(['/mips/details/', name]);
  }

  initFiltersList(): void {
    let filterSaved = this.mipsService.getFilter();
    let sum = filterSaved.arrayStatus.reduce((t, c) => t + c, 0);
    this.showFilterList = sum ? true : false;

    if (filterSaved.arrayStatus[0] === 1) {
      this.filterItemService.add({
        id: '0',
        text: 'accepted',
        value: '0',
        color: '#27AE60',
      });
    }
    if (filterSaved.arrayStatus[1] === 1) {
      this.filterItemService.add({
        id: '1',
        text: 'rejected',
        value: '1',
        color: '#EB5757',
      });
    }
    if (filterSaved.arrayStatus[2] === 1) {
      this.filterItemService.add({
        id: '2',
        text: 'archive',
        value: '2',
        color: '#748AA1',
      });
    }
    if (filterSaved.arrayStatus[3] === 1) {
      this.filterItemService.add({
        id: '3',
        text: 'rfc',
        value: '3',
        color: '#F2994A',
      });
    }
    if (filterSaved.arrayStatus[4] === 1) {
      this.filterItemService.add({
        id: '4',
        text: 'obsolete',
        value: '4',
        color: '#B5B12A',
      });
    }
    if (filterSaved.arrayStatus[5] === 1) {
      this.filterItemService.add({
        id: '5',
        text: 'formal submission',
        value: '5',
        color: '#78288C',
      });
    }
  }

  setQueryParams() {
    this.queryParamsListService.clearStatus();

    let filterSaved = this.mipsService.getFilter();

    let qp: QueryParams = {
      status: [],
      search: this.search,
      mipsetMode: this.mipsetMode,
    };

    if (filterSaved.arrayStatus[0] === 1) {
      qp.status.push('Accepted');
    }
    if (filterSaved.arrayStatus[1] === 1) {
      qp.status.push('Rejected');
    }
    if (filterSaved.arrayStatus[2] === 1) {
      qp.status.push('Archive');
    }
    if (filterSaved.arrayStatus[3] === 1) {
      qp.status.push('RFC');
    }
    if (filterSaved.arrayStatus[4] === 1) {
      qp.status.push('Obsolete');
    }
    if (filterSaved.arrayStatus[5] === 1) {
      qp.status.push('Formal Submission');
    }

    this.queryParamsListService.queryParams = qp;
  }

  updateUrlQueryParams(qp: QueryParams) {
    let navigationExtras: NavigationExtras = {
      queryParams: qp,
    };

    this.router.navigate(['/mips/list'], { ...navigationExtras });
  }

  onCheckedMipsetMode(ev) {
    this.mipsetMode = ev;
    this.setQueryParams();
  }
}
