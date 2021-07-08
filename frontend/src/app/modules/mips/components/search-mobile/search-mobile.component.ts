import { Component, OnInit, Output, EventEmitter, ViewChild, Input, HostBinding, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { SmartSearchService } from '../../services/smart-search.service';
import { debounceTime, map } from 'rxjs/operators';


@Component({
  selector: 'app-search-mobile',
  templateUrl: './search-mobile.component.html',
  styleUrls: ['./search-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  options = [];
  control = new FormControl();
  indexCaretPositionStart: number;
  indexCaretPositionEnd: number;
  isFilteringOption: boolean = false;
  selectedAutocompleteOptionByEnter: boolean = false;
  activatedLabelAutocomplete: string;
  searchOptionsSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private smartSearchService: SmartSearchService
  ) { }

  onKeySearch(event: any): void {
    clearTimeout(this.timeout);

    if (event) {
      if (this.isQuery(event.target.value)) {
        this.isQueryMode = true;
        this.showClose = false;

        if (event.keyCode == 13 && !this.selectedAutocompleteOptionByEnter) {
          this.timeout = setTimeout(() => {
            this.send.emit(event);
          }, 1000);
        } else {
          this.selectedAutocompleteOptionByEnter = false;
          this.filteringOptions();
        }
      } else {
        this.options = [];
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
    this.control.setValue(this.value);
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

  onClickOutside(ev: MouseEvent) {
    ev.stopPropagation();
    this.isOpenHelpPopup = false;
  }

  searchAutocompleteOptions(event: any): void {
    this.options = [];
    this.cdr.detectChanges();

    if (event === '@') {
      this.indexCaretPositionStart = (this.inputSearch
        .nativeElement as HTMLInputElement).selectionStart;
      this.isFilteringOption = true;

      this.searchOptionsSubscription = this.control.valueChanges
        .pipe(debounceTime(10))
        .subscribe((value) => {
          this.indexCaretPositionEnd = (this.inputSearch
            .nativeElement as HTMLInputElement).selectionEnd;

          const search: string = value.slice(
            this.indexCaretPositionStart,
            this.indexCaretPositionEnd
          );

          this.smartSearchService
            .getOptions('status', search)
            .pipe(
              map((data) => {
                const newArray = (data as [])
                  .filter((i: any) => i.status !== '')
                  .map((i: any) => {
                    return { label: i.status };
                  });

                return newArray;
              })
            )
            .subscribe((data: any) => {
              this.options = (data as []).sort(function (a: any, b: any) {
                return a.label < b.label ? -1 : 1;
              });
              this.cdr.detectChanges();
            });
        });

      this.smartSearchService
        .getOptions(
          'status',
          this.control.value.slice(
            this.indexCaretPositionStart,
            this.indexCaretPositionEnd
          )
        )
        .pipe(
          map((data) => {
            const newArray = (data as [])
              .filter((i: any) => i.status !== '')
              .map((i: any) => {
                return { label: i.status };
              });

            return newArray;
          })
        )
        .subscribe((data: any) => {
          this.options = (data as []).sort(function (a: any, b: any) {
            return a.label < b.label ? -1 : 1;
          });
          this.cdr.detectChanges();
        });
    } else if (event === '#') {
      this.indexCaretPositionStart = (this.inputSearch
        .nativeElement as HTMLInputElement).selectionStart;
      this.isFilteringOption = true;

      this.searchOptionsSubscription = this.control.valueChanges
        .pipe(debounceTime(200))
        .subscribe((value) => {
          this.indexCaretPositionEnd = (this.inputSearch
            .nativeElement as HTMLInputElement).selectionEnd;

          const search: string = value.slice(
            this.indexCaretPositionStart,
            this.indexCaretPositionEnd
          );

          this.smartSearchService
            .getOptions('tags', search)
            .pipe(
              map((data) => {
                const newArray = (data as [])
                  .filter((i: any) => i.tag !== '')
                  .map((i: any) => {
                    return { label: i.tag };
                  });

                return newArray;
              })
            )
            .subscribe((data: any) => {
              this.options = (data as []).sort(function (a: any, b: any) {
                return a.label < b.label ? -1 : 1;
              });
              this.cdr.detectChanges();
            });
        });

      this.smartSearchService
        .getOptions(
          'tags',
          this.control.value.slice(
            this.indexCaretPositionStart,
            this.indexCaretPositionEnd
          )
        )
        .pipe(
          map((data) => {
            const newArray = (data as [])
              .filter((i: any) => i.tag !== '')
              .map((i: any) => {
                return { label: i.tag };
              });

            return newArray;
          })
        )
        .subscribe((data: any) => {
          this.options = (data as []).sort(function (a: any, b: any) {
            return a.label < b.label ? -1 : 1;
          });
          this.cdr.detectChanges();
        });
    }
  }

  onClosedOptionsAutocomplete() {
    this.searchOptionsSubscription.unsubscribe();
  }

  filteringOptions() {
    if (this.isFilteringOption) {
      this.indexCaretPositionEnd = (this.inputSearch
        .nativeElement as HTMLInputElement).selectionEnd;
    }
  }

}
