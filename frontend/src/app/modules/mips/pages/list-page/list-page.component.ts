import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import FilterData from '../../components/filter/filter.data';
import { MipsService } from '../../services/mips.service';
import { FooterVisibleService } from '../../../../services/footer-visible/footer-visible.service';
import { FilterListComponent } from '../../components/filter-list/filter-list.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FilterItemService } from 'src/app/services/filter-item/filter-item.service';
import { QueryParamsListService } from '../../services/query-params-list.service';
import QueryParams from '../../types/query-params';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit, AfterViewInit {

  mips: any = [];
  mipsAux: any = [];
  limit = 10;
  limitAux = 10;
  page = 0;
  order: string;
  search: string;
  filter: any;
  filterSaved: FilterData;
  loading: boolean;
  loadingPlus: boolean;
  total: number;
  moreToLoad: boolean;
  mobileSearch = false;
  @ViewChild('filterList', {static: true}) filterList: FilterListComponent;
  showFilterList: boolean = false;
  showListSearch: boolean = false;
  listSearchMip: any[] = [];
  subproposalsMode: boolean;
  mipsByName: any[] = [];
  orderSubproposalField: string = 'subproposal';

  constructor(
    private mipsService: MipsService,
    private footerVisibleService: FooterVisibleService,
    private router: Router,
    private filterItemService: FilterItemService,
    private route: ActivatedRoute,
    private queryParamsListService: QueryParamsListService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.order = 'mip';
    this.subproposalsMode = this.mipsService.subproposalsMode;
    this.initQueryParams();
    this.mipsService.activateSearch$
    .subscribe(data =>  {
      if (data) {
        this.onSendPagination();
        this.mipsService.updateActiveSearch(false);
      }
    });

    this.footerVisibleService.isFooterVisible$.subscribe(data => {
      let elementFeedback = document.getElementById('feedback');
      if (data === true && elementFeedback) {
        elementFeedback.style.position = 'relative';
        elementFeedback.style.bottom = window.innerWidth >= 500 ? '0px' : '-10px';
      } else {
        if (elementFeedback) {
          elementFeedback.style.position = 'fixed';
          elementFeedback.style.bottom = '40px';
        }
      }
    });

    this.queryParamsListService.qParams$.subscribe((data: QueryParams) => {
      console.log('qParams$');

      this.updateUrlQueryParams(data);
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initFiltersList();
    }, 200);
  }

  initQueryParams() {
    let queryParams: any = this.route.snapshot.queryParamMap;

    let status;
    if (queryParams.has("status")) {
      if (typeof queryParams.params.status === "string") {
        (status = []).push(queryParams.params.status);
      } else {
        status = [...queryParams.params.status];
      }
    }

    let qp: QueryParams = {
      status: status ? status : [],
      search: queryParams.params.search
    };

    this.queryParamsListService.queryParams = qp;

    this.queryParamsListService.updateFiltersFromQueryParams();
    this.sendFilters();
  }

  searchMips(): void {
      this.mipsService.searchMips(this.limit, this.page, this.order, this.search, this.filter)
      .subscribe(data => {
        this.mipsAux = data.items;
        this.mips = this.mips.concat(this.mipsAux);
        this.mipsService.setMipsData(this.mips);
        this.total = data.total;
        this.mipsService.setTotal(this.total);
        this.loading = false;
        this.loadingPlus = false;
        if (this.limitAux >= this.total) {
          this.moreToLoad = false;
        } else {
          this.moreToLoad = true;
        }
      });
  }

  searchMipsByName(limit, page, order, search, filter): void {
    this.mipsService.searchMips(limit, page, order, search, filter)
    .subscribe(data => {
      this.mipsByName = data.items;

      this.showListSearch = true;
      this.listSearchMip = this.mipsByName.map(item => {
        return {
          content: item.mipName + " " + (item.title !== undefined ? item.title : ""),
          id: item._id
        }
      });
    });
}

  onSendPagination(): void {
      this.loadingPlus = true;
      this.page++;
      this.limitAux += 10;
      if (this.moreToLoad) {
        this.searchMips();
      }
  }

  onSendFilters() {
    this.sendFilters();
    this.setQueryParams();
  }

  sendFilters(): void {
    this.loading = true;
    this.limitAux = 10;
    this.mips = [];
    this.page = 0;
    this.filter = {
      contains: [],
      notcontains: [],
      equals: [],
      notequals: [],
      inarray: []
    };

    this.filterSaved = this.mipsService.getFilter();
    this.filter.notequals.push({field: 'mip', value: -1});

    if (this.filterSaved.type === 'PROPOSAL') {
      this.filter.notequals.push({field: 'mip', value: -1});
    }
    if (this.filterSaved.type === 'SUB-PROPOSAL') {
      this.filter.equals.push({field: 'mip', value: -1});
    }
    if (this.filterSaved.arrayStatus[0] === 1) {
      this.filter.inarray.push({field: 'status', value: 'Accepted' });
    }
    if (this.filterSaved.arrayStatus[1] === 1) {
      this.filter.inarray.push({field: 'status', value: 'Rejected' });
    }
    if (this.filterSaved.arrayStatus[2] === 1) {
      this.filter.inarray.push({field: 'status', value: 'Archive' });
    }
    if (this.filterSaved.arrayStatus[3] === 1) {
      this.filter.inarray.push({field: 'status', value: 'RFC' });
      this.filter.inarray.push({field: 'status', value: "Request for Comments (RFC)" });
      this.filter.inarray.push({field: 'status', value: "Request for Comments" });
    }
    if (this.filterSaved.arrayStatus[4] === 1) {
      this.filter.inarray.push({field: 'status', value: 'Obsolete' });
    }
    if (this.filterSaved.arrayStatus[5] === 1) {
      this.filter.inarray.push({field: 'status', value: 'Formal Submission' });
      this.filter.inarray.push({field: 'status', value: "Formal Submission (FS)" });
    }
    if (!this.subproposalsMode) {
      this.filter.equals.push({field: 'proposal', value: ""});
    } else {
      let index = this.filter.equals.findIndex(item => item.field === 'proposal');

      if (index !== -1) {
        this.filter.equals.splice(index, 1);
      }

      this.order = 'mip' + ' ' + this.orderSubproposalField;
    }

    this.searchMips();
  }

  onSendSearch(event: any): void {
    let search = event.target.value.toLowerCase().trim();

    if (search.startsWith('mip')) {
      if (event.keyCode == 13 && this.listSearchMip.length > 0) {
        this.goToMipDetails(this.listSearchMip[0].id);
      }
      let filter = {
        contains: [],
      };
      filter.contains.push({field: 'mipName', value: event.target.value});
      this.searchMipsByName(0, 0, 'mipName', '', filter);
      this.limit = 0;
    } else {
      this.listSearchMip = [];
      this.loading = true;
      this.limitAux = 10;
      this.mips = [];
      this.page = 0;
      this.search = event.target.value;
      this.searchMips();
    }

    this.setQueryParams();
  }

  onSendOrder(text: string): void {
    this.loading = true;
    this.mips = [];
    this.limitAux = 10;
    this.page = 0;
    this.order = (this.subproposalsMode && text === 'mip') ? text + " " + this.orderSubproposalField : text;
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
    this.onSendFilters();
  }

  onHasItemsFilterList(event) {
    this.showFilterList = event;
  }

  onNavigateToMipDetails(event) {
    this.goToMipDetails(event.id);
  }

  goToMipDetails(id) {
    this.router.navigate(["/mips/details/", id]);
  }

  onCheckedSubproposalMode(event) {
    this.mipsService.subproposalsMode = event;
    this.order = (event && this.order === 'mip') ? this.order + ' ' + this.orderSubproposalField : this.order.replace(this.orderSubproposalField, '').trim();
    this.subproposalsMode = event;
    this.onSendFilters();
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
        color: '#27AE60'
      });
    }
    if (filterSaved.arrayStatus[1] === 1) {
      this.filterItemService.add({
        id: '1',
        text: 'rejected',
        value: '1',
        color: '#EB5757'
      });
    }
    if (filterSaved.arrayStatus[2] === 1) {
      this.filterItemService.add({
        id: '2',
        text: 'archive',
        value: '2',
        color: '#748AA1'
      });
    }
    if (filterSaved.arrayStatus[3] === 1) {
      this.filterItemService.add({
        id: '3',
        text: 'rfc',
        value: '3',
        color: '#F2994A'
      });
    }
    if (filterSaved.arrayStatus[4] === 1) {
      this.filterItemService.add({
        id: '4',
        text: 'obsolete',
        value: '4',
        color: '#B5B12A'
      });
    }
    if (filterSaved.arrayStatus[5] === 1) {
      this.filterItemService.add({
        id: '5',
        text: 'formal submission',
        value: '5',
        color: '#78288C'
      });
    }
  }

  setQueryParams() {
    this.queryParamsListService.clearStatus();

    let filterSaved = this.mipsService.getFilter();

    let qp: QueryParams = {
      status: [],
      search: this.search
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
      queryParams: qp
    }

    this.router.navigate(['/mips/list'], {...navigationExtras});
  }
}
