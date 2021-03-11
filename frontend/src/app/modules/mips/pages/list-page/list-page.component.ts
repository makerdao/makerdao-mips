import { Component, OnInit } from '@angular/core';
import FilterData from '../../components/filter/filter.data';
import { MipsService } from '../../services/mips.service';
import { FooterVisibleService } from '../../../../services/footer-visible/footer-visible.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {

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

  constructor(
    private mipsService: MipsService,
    private footerVisibleService: FooterVisibleService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.order = 'mip';
    this.onSendFilters();
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
    })
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

  onSendPagination(): void {
      this.loadingPlus = true;
      this.page++;
      this.limitAux += 10;
      if (this.moreToLoad) {
        this.searchMips();
      }
  }

  onSendFilters(): void {
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
    this.searchMips();
  }

  onSendSearch(text: string): void {
    this.loading = true;
    this.limitAux = 10;
    this.mips = [];
    this.page = 0;
    this.search = text;
    this.searchMips();
  }

  onSendOrder(text: string): void {
    this.loading = true;
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
    this.onSendFilters();
  }

}
