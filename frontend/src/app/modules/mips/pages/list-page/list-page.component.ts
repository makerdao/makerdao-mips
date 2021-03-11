import { Component, OnInit } from '@angular/core';
import FilterData from '../../components/filter/filter.data';
import { MipsService } from '../../services/mips.service';
import { FooterVisibleService } from '../../../../services/footer-visible/footer-visible.service';
import { Router } from '@angular/router';

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
  showListSearch: boolean = false;
  listSearchMip: any[] = [];
  subproposalsMode: boolean;
  mipsByName: any[] = [];

  constructor(
    private mipsService: MipsService,
    private footerVisibleService: FooterVisibleService,
    private router: Router
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

  onSendFilters(): void {
    this.loading = true;
    this.limitAux = 10;
    this.mips = [];
    this.page = 0;
    this.filter = {
      contains: [],
      notcontains: [],
      equals: [],
      notequals: []
    };

    this.filterSaved = this.mipsService.getFilter();
    this.filter.notequals.push({field: 'mip', value: -1});

    if (this.filterSaved.type === 'PROPOSAL') {
      this.filter.notequals.push({field: 'mip', value: -1});
    }
    if (this.filterSaved.type === 'SUB-PROPOSAL') {
      this.filter.equals.push({field: 'mip', value: -1});
    }
    if (this.filterSaved.title !== '') {
      this.filter.contains.push({field: 'title', value: this.filterSaved.title });
    }
    if (this.filterSaved.arrayStatus[0] === 1) {
      this.filter.contains.push({field: 'status', value: 'accepted' });
    }
    if (this.filterSaved.arrayStatus[1] === 1) {
      this.filter.contains.push({field: 'status', value: 'rejected' });
    }
    if (this.filterSaved.arrayStatus[2] === 1) {
      this.filter.contains.push({field: 'status', value: 'archive' });
    }
    if (this.filterSaved.arrayStatus[3] === 1) {
      this.filter.contains.push({field: 'status', value: 'rfc' });
    }
    if (this.filterSaved.arrayStatus[4] === 1) {
      this.filter.contains.push({field: 'status', value: 'obsolete' });
    }
    if (!this.subproposalsMode) {
      this.filter.equals.push({field: 'proposal', value: ""});
    } else {
      let index = this.filter.equals.findIndex(item => item.field === 'proposal');

      if (index !== -1) {
        this.filter.equals.splice(index, 1);
      }
    }

    this.searchMips();
  }

  onSendSearch(text: string): void {
    let search = text.toLowerCase().trim();

    if (search.startsWith('mip')) {
      let filter = {
        contains: [],
      };
      filter.contains.push({field: 'mipName', value: text});
      this.searchMipsByName(0, 0, 'mipName', '', filter);
      this.limit = 0;
    } else {
      this.listSearchMip = [];
      this.loading = true;
      this.limitAux = 10;
      this.mips = [];
      this.page = 0;
      this.search = text;
      this.searchMips();
    }
  }

  onSendOrder(text: string): void {
    this.loading = true;
    this.mips = [];
    this.limitAux = 10;
    this.page = 0;
    this.order = (this.subproposalsMode && text === 'mip') ? text + " mipName" : text;
    this.searchMips();
  }

  onOpenMobileSearch(open: boolean): void {
    this.mobileSearch = open;
  }

  onNavigateToMipDetails(event) {
    this.router.navigate(["/mips/details/", event.id]);
  }

  onCheckedSubproposalMode(event) {
    this.order = (event && this.order === 'mip') ? this.order + ' mipName' : this.order.replace('mipName', '').trim();
    this.subproposalsMode = event;
    this.onSendFilters();
  }
}
