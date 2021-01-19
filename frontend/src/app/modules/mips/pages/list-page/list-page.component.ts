import { Component, OnInit } from '@angular/core';
import FilterData from '../../components/filter/filter.data';
import { MipsService } from '../../services/mips.service';

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

  constructor(
    private mipsService: MipsService
  ) { }

  ngOnInit(): void {
    this.searchMips();
  }

  searchMips(): void {
      this.mipsService.searchMips(this.limit, this.page, this.order, this.search, this.filter)
      .subscribe(data => {
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
      });
  }

  onSendPagination(): void {
      this.loadingPlus = true;
      this.page++;
      this.limitAux += 10;
      this.searchMips();
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

    if (this.filterSaved.type === 'PROPOSAL') {
      this.filter.notequals.push({field: 'mip', value: -1});
    }
    if (this.filterSaved.type === 'SUB-PROPOSAL') {
      this.filter.equals.push({field: 'mip', value: -1});
    }
    if (this.filterSaved.title !== '') {
      this.filter.contains.push({field: 'title', value: this.filterSaved.title });
    }
    if (this.filterSaved.status !== 'Select status') {
      this.filter.contains.push({field: 'status', value: this.filterSaved.status });
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

}
