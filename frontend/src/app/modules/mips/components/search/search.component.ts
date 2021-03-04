import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {

@Input() placeHolder ? = 'Search on the list';
@Input() imageDir ? = '../../../../../assets/images/magnifier.png';
@Input() imageClose ? = '../../../../../assets/images/close.png';
@Output() send = new EventEmitter();
timeout: any = null;
@ViewChild('search') inputSearch;
showClose = false;
@Input() showListSearch = false;
@Input() listSearchItems = [];

  constructor() { }

  ngOnInit(): void {}

  onKeySearch(event: any): void {
    this.showClose = this.inputSearch.nativeElement.value === '' ? false : true;
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = setTimeout(() => {
        $this.onChange(this.inputSearch.nativeElement.value);
    }, 1000);
  }

  onChange(value: string): void {
    this.send.emit(value);
  }

  clear(): void {
    this.showClose = false;
    this.inputSearch.nativeElement.value = '';
    this.onChange(this.inputSearch.nativeElement.value);
  }
}
