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
  limit = 0;
  page = 0;
  order: string;
  search: string;
  filter: any;
  filterSaved: FilterData;
  loading: boolean;
  total: number;

  constructor(
    private mipsService: MipsService
  ) { }

  ngOnInit(): void {
    this.searchMips();
  }

  searchMips(): void {
      this.loading = true;
      this.mipsService.searchMips(this.limit, this.page, this.order, this.search, this.filter)
      .subscribe(data => {
        this.mips = data.items;
        this.total = data.total;
        this.loading = false;
      });
  }

  onSendPagination(index: number): void {
    this.page = index;
    this.searchMips();

  }

  onSendFilters(): void {

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
    this.searchMips();
  }

  onSendSearch(text: string): void {
    this.search = text;
    this.searchMips();
  }

  onSendOrder(text: string): void {
    this.order = text;
    this.searchMips();
  }

}
