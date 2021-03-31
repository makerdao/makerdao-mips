import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

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
@Output() clickSearchItem = new Subject<any>();
@Input() value: string;

  constructor() { }

  ngOnInit(): void {
    this.showClose = this.value ? true : false;
  }

  onKeySearch(event: any): void {
    this.showClose = this.inputSearch.nativeElement.value === '' ? false : true;
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = setTimeout(() => {
        $this.onChange(event);
    }, 1000);
  }

  onChange(event: any): void {
    if (event) {
      this.send.emit(event);
    }
  }

  clear(): void {
    this.showClose = false;
    this.inputSearch.nativeElement.value = '';
    let event = new Event('keyup');
    this.inputSearch.nativeElement.dispatchEvent(event);
  }

  onClickSearchItem(element) {
    this.clickSearchItem.next(element);
  }
}
