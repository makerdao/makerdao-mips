import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ConnectedPosition } from '@angular/cdk/overlay';

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
isQueryMode: boolean = false;
positionHelpPopup: ConnectedPosition[] = new Array<ConnectedPosition>();
isOpenHelpPopup: boolean = false;
helpIconDark: string = '../../../../../assets/images/help_icon.svg';
helpIconBlue: string = '../../../../../assets/images/help_icon_blue.svg';

  constructor() { }

  ngOnInit(): void {
    this.showClose = this.value ? true : false;
    this.initPositionHelpPopup();
  }

  initPositionHelpPopup() {
    this.positionHelpPopup = [
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      }
    ];
  }

  openHelpPopup() {
    this.isOpenHelpPopup = !this.isOpenHelpPopup;
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
      if (this.isQuery(event.target.value)) {
        this.isQueryMode = true;

        if (event.keyCode == 13) {
          this.send.emit(event);
        }
      } else {
        this.isQueryMode = false;
        this.send.emit(event);
      }
    }
  }

  isQuery(data: string): boolean {
    let search = data.toLowerCase().trim();

    return search.startsWith('$');
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
