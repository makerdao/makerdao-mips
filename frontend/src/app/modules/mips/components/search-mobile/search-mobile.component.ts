import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';


@Component({
  selector: 'app-search-mobile',
  templateUrl: './search-mobile.component.html',
  styleUrls: ['./search-mobile.component.scss']
})
export class SearchMobileComponent implements OnInit {

  @Output() send = new EventEmitter();
  timeout: any = null;
  @ViewChild('search') inputSearch;
  showClose = false;
  showInput = false;
  text = '';

  constructor() { }

  onKeySearch(event: any): void {
    this.showClose = this.inputSearch.nativeElement.value === '' ? false : true;
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = setTimeout(() => {
        $this.onChange(this.inputSearch.nativeElement.value);
    }, 1000);
  }

  onChange(value: string): void {
    this.text = value;
    this.send.emit(value);
  }

  clear(): void {
    this.showClose = false;
    this.inputSearch.nativeElement.value = '';
    this.text = '';
    this.onChange(this.inputSearch.nativeElement.value);
    this.showInput = false;
  }

  ngOnInit(): void {
  }

}
