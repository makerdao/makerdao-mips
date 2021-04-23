import { Component, OnInit, Output, EventEmitter, ViewChild, Input, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { ConnectedPosition } from '@angular/cdk/overlay';


@Component({
  selector: 'app-search-mobile',
  templateUrl: './search-mobile.component.html',
  styleUrls: ['./search-mobile.component.scss']
})
export class SearchMobileComponent implements OnInit {

  @Output() send = new EventEmitter();
  @Output() open = new EventEmitter<boolean>();
  timeout: any = null;
  @ViewChild('search') inputSearch;
  showClose = false;
  showInput = false;
  text = '';
  @Input() showListSearch = false;
  @Input() listSearchItems = [];
  @Output() clickSearchItem = new Subject<any>();
  @Input() value: string;
  isQueryMode: boolean = false;
  positionHelpPopup: ConnectedPosition[] = new Array<ConnectedPosition>();
  isOpenHelpPopup: boolean = false;
  helpIconDark: string = '../../../../../assets/images/help_icon.svg';
  helpIconBlue: string = '../../../../../assets/images/help_icon_blue.svg';
  @Input() error: boolean = false;
  @Input() errorMessage: string = '';
  @Input() imageClose? = '../../../../../assets/images/close.png';

  constructor() { }

  onKeySearch(event: any): void {
    clearTimeout(this.timeout);

    if (event) {
      if (this.isQuery(event.target.value)) {
        this.isQueryMode = true;
        this.showClose = false;

        if (event.keyCode == 13) {
          this.timeout = setTimeout(() => {
            this.send.emit(event);
          }, 1000);
        }
      } else {
        this.isQueryMode = false;
        this.showClose =
          this.inputSearch.nativeElement.value === '' ? false : true;

        this.timeout = setTimeout(() => {
          this.send.emit(event);
        }, 1000);
      }
    }
  }

  isQuery(data: string): boolean {
    let search = data.toLowerCase().trim();

    return search.startsWith('$');
  }

  // onChange(event: any): void {
  //   if (event) {
  //     this.text = event.target.value;
  //     this.send.emit(event);
  //   }
  // }

  clear(): void {
    this.showClose = false;
    this.inputSearch.nativeElement.value = '';
    this.text = '';
    let event = new Event('keyup');
    this.inputSearch.nativeElement.dispatchEvent(event);
    this.onOpenCloseInput();
  }

  ngOnInit(): void {
    this.initPositionHelpPopup();
  }

  initPositionHelpPopup() {
    this.positionHelpPopup = [
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
    ];
  }

  openHelpPopup() {
    this.isOpenHelpPopup = !this.isOpenHelpPopup;
  }

  onOpenCloseInput(): void {
    this.showInput = !this.showInput;
    this.open.emit(this.showInput);
  }

  onClickSearchItem(element) {
    this.clickSearchItem.next(element);
  }

  @HostBinding('class.spread')
  get spread() {
    return this.showInput;
  }

}
