import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import FilterData from '../../components/filter/filter.data';
import {MipsService} from '../../services/mips.service';
import {FooterVisibleService} from '../../../../services/footer-visible/footer-visible.service';
import {FilterListComponent} from '../../components/filter-list/filter-list.component';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {FilterItemService} from 'src/app/services/filter-item/filter-item.service';
import {QueryParamsListService} from '../../services/query-params-list.service';
import QueryParams from '../../types/query-params';
import {ElementsRefUiService} from '../../../../services/elements-ref-ui/elements-ref-ui.service';
import {Subscription} from 'rxjs';
import {fromEvent} from 'rxjs';
import {IMip} from '../../types/mip';
import {SearchService} from '../../services/search.service';
import {FilterService} from '../../services/filter.service';
import {map} from 'rxjs/operators';
import {Order, OrderField, OrderFieldName} from '../../types/order';
import {OrderService} from '../../services/order.service';
import {ComponentMip} from '../../types/component-mip';
import {ISubsetDataElement} from '../../types/subset';
import {DarkModeService} from 'src/app/services/dark-mode/dark-mode.service';
import {DomSanitizer} from '@angular/platform-browser';

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
  search = '';
  searchCopy = '';
  filter: any;
  filterSaved: FilterData;
  loading = false;
  total: number;
  moreToLoad: boolean;
  mobileSearch = false;
  @ViewChild('filterList', {static: true}) filterList: FilterListComponent;
  showFilterList = false;
  showListSearch = false;
  showHideParentCheckbox = false;
  hideParentValue = false;

  listSearchMip: any[] = [];
  mipsByName: any[] = [];
  sintaxError = false;
  errorMessage = '';
  defaultSearch =
    '$ and(not(@Obsolete), not(@Withdrawn), not(@Rejected))';
  mobileView = false;
  mipsetMode = false;
  activeMenuLinkName = '';
  initActiveLinkName = 'MIPs List';
  limitMipsSuggestions = 10;
  pageMipsSuggestions = 0;
  loadingMipsSuggestions = false;
  subscriptionLoadSuggestions = new Subscription();
  totalMipsSuggestion = 0;
  searchSuggestions = false;
  orderObj: Order;
  multipleQueries = false;
  shouldBeExpandedMultiQuery = true;
  statusParameters = false;

  constructor(
    private mipsService: MipsService,
    private footerVisibleService: FooterVisibleService,
    private router: Router,
    private filterItemService: FilterItemService,
    private route: ActivatedRoute,
    private queryParamsListService: QueryParamsListService,
    private elementsRefUiService: ElementsRefUiService,
    private orderService: OrderService,
    private searchService: SearchService,
    public darkModeService: DarkModeService,
    private filterService: FilterService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initParametersToLoadData();
    this.searchMips();

    this.footerVisibleService.isFooterVisible$.subscribe((data) => {
      const elementFeedback = document.getElementById('feedback');
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

    this.route.queryParams.subscribe(params => {
      this.showHideParentCheckbox = !!this.search;
      this.hideParentValue = false;

      if (params.hideParents === 'true') {
        this.hideParentValue = true;
      }
    });
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
    const queryParams: any = this.route.snapshot.queryParamMap;
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
      customViewName: queryParams.params.customViewName,
      orderBy: queryParams.params.orderBy,
      orderDirection: queryParams.params.orderDirection,
      hideParents: queryParams.params.hideParents,
    };
    if (qp.customViewName) {
      qp = {
        ...qp,
        hideParents: qp.hideParents,
        shouldBeExpandedMultiQuery: qp.shouldBeExpandedMultiQuery,
      };
      this.shouldBeExpandedMultiQuery = (qp?.shouldBeExpandedMultiQuery?.toString() && JSON.parse(qp.shouldBeExpandedMultiQuery.toString())) ?? true;
    }


    this.hideParentValue = qp.hideParents
      ? JSON.parse(qp.hideParents.toString())
      : false;


    for (const key in queryParams.params) {
      if (key.startsWith('_')) {
        qp[key] = queryParams.params[key];
        this.multipleQueries = true;
      }
    }

    this.queryParamsListService.queryParams = qp;

    this.searchCopy = this.defaultSearch;
    this.activeMenuLinkName =
      queryParams.params.customViewName || this.initActiveLinkName;

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
    this.filterService.filter.next(this.filter);
  }

  initSearch() {
    const queryParams: QueryParams = this.queryParamsListService.queryParams;

    // Parse query param to detect any unwanted encoded HTML, then sanitize it
    let parsedTextSearchParam = null;
    if (queryParams.search) {
      const parsedSearchParam = new DOMParser().parseFromString(
        queryParams.search,
        'text/html'
      );
      parsedTextSearchParam = parsedSearchParam.documentElement.textContent;
    }

    this.search = this.sanitizer.sanitize(1, parsedTextSearchParam);
    this.searchService.search.next(this.search);
  }

  initOrderBy() {
    const queryParams: QueryParams = this.queryParamsListService.queryParams;
    let prefixDirection = '';
    prefixDirection =
      !queryParams.orderDirection || queryParams.orderDirection == 'ASC'
        ? ''
        : '-';
    prefixDirection =
      queryParams.orderBy == OrderFieldName.MostUsed &&
      !queryParams.orderDirection
        ? '-'
        : prefixDirection;
    this.order = queryParams.orderBy
      ? prefixDirection + OrderField[queryParams.orderBy]
      : 'mip mipName';
    this.orderObj = {
      field: queryParams.orderBy,
      direction:
        queryParams.orderBy && queryParams.orderDirection
          ? queryParams.orderDirection
          : 'ASC',
    };

    this.orderService.order = {
      field: queryParams.orderBy,
      direction:
        queryParams.orderBy && queryParams.orderDirection
          ? queryParams.orderDirection
          : 'ASC',
    };
  }

  initFilterContributor() {
    if (this.queryParamsListService.queryParams.contributor) {
      this.pushFilterInarray(this.filter.inarray, {
        field: 'contributors',
        value: [this.queryParamsListService.queryParams.contributor],
      });
    }
  }

  initFilterAuthor() {
    if (this.queryParamsListService.queryParams.author) {
      this.pushFilterInarray(this.filter.inarray, {
        field: 'author',
        value: [this.queryParamsListService.queryParams.author],
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

    this.filter.notequals.push({field: 'mip', value: -1});

    this.setFiltersStatus();
  }

  setFiltersStatus() {
    const filter = {...this.filter};

    this.filterSaved = this.mipsService.getFilter();

    if (this.filterSaved.arrayStatus[0] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Accepted'],
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Accepted'],
      });
    }
    if (this.filterSaved.arrayStatus[1] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Rejected'],
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Rejected'],
      });
    }
    if (this.filterSaved.arrayStatus[2] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Archive'],
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Archive'],
      });
    }
    if (this.filterSaved.arrayStatus[3] === 1) {
      this.pushFilterInarray(filter.inarray, {field: 'status', value: 'RFC'});
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Request for Comments (RFC)'],
      });
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Request for Comments'],
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['RFC'],
      });
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Request for Comments (RFC)'],
      });
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Request for Comments'],
      });
    }
    if (this.filterSaved.arrayStatus[4] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Obsolete'],
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Obsolete'],
      });
    }
    if (this.filterSaved.arrayStatus[5] === 1) {
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Formal Submission'],
      });
      this.pushFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Formal Submission (FS)'],
      });
    } else {
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Formal Submission'],
      });
      this.deleteFilterInarray(filter.inarray, {
        field: 'status',
        value: ['Formal Submission (FS)'],
      });
    }

    this.filter = {...filter};
    this.filterService.filter.next(this.filter);
  }

  pushFilterInarray(array: Array<any>, data: any) {
    const item = array.find(
      (i) => i.field === data.field && i.value === data.value
    );

    if (!item) {
      array.push(data);
    }
  }

  deleteFilterInarray(array: Array<any>, data: any) {
    const index = array.findIndex(
      (i) => i.field === data.field && i.value === data.value
    );

    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  searchMips(): void {
    const index = this.filter.equals.findIndex(
      (item) => item.field === 'proposal'
    );

    if (this.filterOrSearch()) {
      // filter or search
      if (index !== -1) {
        this.filter.equals.splice(index, 1); // include subproposals in searching
      }
    } else {
      if (index === -1) {
        this.filter.equals.push({field: 'proposal', value: ''}); // no subproposals
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
          this.order,
          this.searchCopy,
          this.filter,
          'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather components subproposalsCount forumLink votingPortalLink mipCodeNumber'
        )
        .pipe(
          map((res) => {
            (res.items as IMip[]).map((item) => {
              item.showArrowExpandChildren = true;

              if (item.mipFather) {
                item.hide = false;
              }
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
              this.loading = false;
              this.showHideParentCheckbox = false;
            } else {
              this.sintaxError = false;
              this.errorMessage = '';
            }
          }
        );
    }
  }

  async hidingSubproposalsUnderParents(data): Promise<any> {
    const newData: IMip[] = [];
    const forLoop = async () => {
      for (let index = 0; index < data.items.length; index++) {
        const item: IMip = data.items[index];
        const indexFatherInMips = this.indexFather(item, this.mips);
        const indexFatherInNewData = this.indexFather(item, newData);

        if (
          item.proposal !== '' &&
          indexFatherInMips === -1 &&
          indexFatherInNewData === -1
        ) {

          this.addSubsetField(data.items[index]);
          const res: any = await this.mipsService
            .searchMips(
              1,
              0,
              null,
              null,
              {equals: [{field: 'mipName', value: item.proposal}]},
              'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather components subproposalsCount forumLink votingPortalLink mipCodeNumber'
            )
            .toPromise();
          if (res.items[0]) {
            const parent: IMip = res.items[0];
            parent.expanded = true;
            parent.hide = true;
            parent.showArrowExpandChildren = true;
            parent.children = [];
            parent.children.push(item);
            const subproposalsGroup: any = this.groupBy(
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

          const subproposalsGroup: any = this.groupBy(
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
          this.mips[indexFatherInMips].expanded = true;
          this.mips[indexFatherInMips].showArrowExpandChildren = true;
          this.mips[indexFatherInMips].children.push(item);

          const subproposalsGroup: any = this.groupBy(
            'subset',
            this.mips[indexFatherInMips].children
          );

          if (this.order === 'mip' || this.order === 'mip mipName') {
            this.sortSubproposalsGroups(subproposalsGroup);
          }

          const subsetRows: ISubsetDataElement[] = [];
          const components: ComponentMip[] =
            this.mips[indexFatherInMips].components;
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

          this.mips[indexFatherInMips].subproposalsGroup = subproposalsGroup;
          this.mips[indexFatherInMips].subsetRows = subsetRows;
          this.mips[indexFatherInMips].expanded = true;
        } else if (!item.proposal) {
          const indexItemInLoadedMips = this.indexItemInLoadedMips(
            item,
            this.mips
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
    this.mips = this.mips.concat(this.mipsAux);
    this.total = data.total;
    this.loading = false;

    if (this.limitAux >= this.total) {
      this.moreToLoad = false;
    } else {
      this.moreToLoad = true;
    }
  }

  onCheckedHideParents($event): void {
    const queryParams: any = this.route.snapshot.queryParamMap;
    const qp: QueryParams = {
      ...queryParams.params,
      hideParents: $event
    };

    this.hideParentValue = $event;
    this.queryParamsListService.queryParams = qp;
    this.updateUrlQueryParams(qp);
  }

  indexFather(mip: IMip, mips: IMip[]) {
    return mips.findIndex((item) => mip.proposal === item.mipName);
  }

  indexItemInLoadedMips(mip: IMip, mips: IMip[]) {
    return mips.findIndex((item) => mip.mipName === item.mipName);
  }

  addSubsetField = (item: any) => {
    const subset: string = (item.mipName as string)?.split('SP')[0];
    item.subset = subset;

    // this conditional is only to fix some css issue
    if (!item.sentenceSummary) {
      item.sentenceSummary = '<p style="width:150px;"></p>'; // this is just to allow the arrow of the align the sentence summary with others arrows
    }
    
    return item;
  };

  groupBy(field, arr: any[]): any {
    const group: any = arr.reduce((r, a) => {
      r[a[field]] = [...(r[a[field]] || []), a];
      return r;
    }, {});

    return group;
  }

  sortSubproposalsGroups(subproposalsGroup: any) {
    for (const key in subproposalsGroup) {
      if (Object.prototype.hasOwnProperty.call(subproposalsGroup, key)) {
        const element: any[] = subproposalsGroup[key];
        subproposalsGroup[key] = this.sortSubproposalGroup(element);
      }
    }
  }

  sortSubproposalGroup(arr: any[]) {
    return arr.sort(function(a: any, b: any) {
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

  searchMipsByName(
    limit,
    page,
    order,
    search,
    filter,
    stopLoadingOnComplete = false
  ): void {
    this.loadingMipsSuggestions = true;
    this.loading = true;
    this.subscriptionLoadSuggestions = this.mipsService
      .searchMips(
        limit,
        page,
        order,
        search,
        filter,
        'title proposal mipName filename paragraphSummary sentenceSummary mip status mipFather components subproposalsCount forumLink votingPortalLink'
      )
      .subscribe(
        (data) => {
          this.mipsByName = data.items;

          this.showListSearch = true;
          const items: any[] = this.mipsByName.map((item) => {
            const cleanedTitle = item.title.replace(/[^\w]*/g, '');
            const cleanedMipName = item.mipName.replace(/[^\w]*/g, '');

            const titleContainsMipsName =
              cleanedTitle?.includes(cleanedMipName);

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
          if (!stopLoadingOnComplete) {
            this.loading = false;
          }

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
    const search = event.target.value.toLowerCase().trim();
    this.search = this.sanitizer.sanitize(1, event.target.value);
    this.searchService.search.next(event.target.value);

    this.showHideParentCheckbox = !!this.search;

    const query: any = this.route.snapshot.queryParamMap;
    this.hideParentValue = query.params.hideParents?.toString() === 'true';

    if (search.startsWith('mip')) {
      if (event.keyCode == 13 && this.listSearchMip.length > 0) {
        this.goToMipDetails(this.listSearchMip[0].mipName);
      } else {
        this.searchSuggestions = true;
        this.pageMipsSuggestions = 0;
        this.listSearchMip = [];
        this.limitAux = 10;
        this.mips = [];
        const filter = {
          contains: [],
        };
        const search = event.target.value;

        if (search.match(/^mip/i)) {
          filter.contains.push({
            field: 'mipName',
            value: search.replace(/[-:\s]/g, ''),
          });
        } else {
          filter.contains.push({field: 'title', value: search});
        }

        this.subscriptionLoadSuggestions.unsubscribe();
        this.searchMipsByName(
          this.limitMipsSuggestions,
          this.pageMipsSuggestions,
          'mip mipName',
          '',
          filter,
          true
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
      this.search = this.sanitizer.sanitize(1, event.target.value);
      this.searchMips();
      this.setQueryParams();
    }
  }

  onLoadMoreMipsSuggestions() {
    if (this.listSearchMip.length < this.totalMipsSuggestion) {
      this.pageMipsSuggestions++;
      this.limitAux += 10;
      const filter = {
        contains: [],
      };
      filter.contains.push({field: 'mipName', value: this.search});
      this.searchMipsByName(
        this.limitMipsSuggestions,
        this.pageMipsSuggestions,
        'mip mipName',
        '',
        filter
      );
    }
  }

  onSendOrder(data: { orderText: string; orderObj: Order }): void {
    this.orderObj = {
      field: data.orderObj.field,
      direction:
        data.orderObj.field && data.orderObj.direction
          ? data.orderObj.direction
          : 'ASC',
    };

    this.mips = [];
    this.limitAux = 10;
    this.page = 0;
    this.order = data.orderText;
    this.searchMips();
    this.setQueryParams();
  }

  changeOrder(data: { orderText: string; orderObj: Order }) {
    this.orderObj = {
      field: data.orderObj.field,
      direction:
        data.orderObj.field && data.orderObj.direction
          ? data.orderObj.direction
          : 'ASC',
    };

    this.setQueryParams();
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
    const filterSaved = this.mipsService.getFilter();
    const sum = filterSaved.arrayStatus.reduce((t, c) => t + c, 0);
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

    const filterSaved = this.mipsService.getFilter();

    const qp: QueryParams = {
      ...this.queryParamsListService.queryParams,
      status: [],
      search: this.search,
      mipsetMode: this.mipsetMode,
      orderBy: this.orderObj.field,
      orderDirection: this.orderObj.direction,
    };

    this.showHideParentCheckbox = !!this.search;

    const query: any = this.route.snapshot.queryParamMap;

    this.hideParentValue = query.params.hideParents?.toString() === 'true';

    if (!qp.hideParents) {
      qp.hideParents = false;
    }
    this.hideParentValue = JSON.parse(qp.hideParents.toString());

    if (this.mipsetMode) {
      delete qp.hideParents;
    }

    if (qp?.search?.includes('$')) {
      this.statusParameters = true;
    }

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
    const navigationExtras: NavigationExtras = {
      queryParams: qp,
    };

    if (!qp?.search?.includes('$') || qp?.mipsetMode == true) {
      this.statusParameters = true;
    }
    this.router.navigate([], {...navigationExtras});
  }

  onCheckedMipsetMode(ev) {
    this.mipsetMode = ev;
    this.setQueryParams();
  }
}
