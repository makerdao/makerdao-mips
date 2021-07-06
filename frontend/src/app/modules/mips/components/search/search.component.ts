import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { SmartSearchService } from '../../services/smart-search.service';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  @Input() placeHolder? = 'Search on the list';
  @Input() imageDir? = '../../../../../assets/images/magnifier.png';
  @Input() imageClose? = '../../../../../assets/images/close.png';
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
  @Input() error: boolean = false;
  @Input() errorMessage: string = '';
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
  ) {}

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

  clear(): void {
    this.showClose = false;
    this.inputSearch.nativeElement.value = '';
    let event = new Event('keyup');
    this.inputSearch.nativeElement.dispatchEvent(event);
  }

  onClickSearchItem(element) {
    this.clickSearchItem.next(element);
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
                const newArray = (data as []).map((i: any) => {
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
            const newArray = (data as []).map((i: any) => {
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
                const newArray = (data as []).map((i: any) => {
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
            const newArray = (data as []).map((i: any) => {
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
