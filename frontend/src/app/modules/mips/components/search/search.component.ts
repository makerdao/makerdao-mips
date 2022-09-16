import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {FormControl} from '@angular/forms';
import {SmartSearchService} from '../../services/smart-search.service';
import {debounceTime, filter, map, takeUntil} from 'rxjs/operators';
import {position} from 'caret-pos';
import IFormatting from '../../types/formatting';
import {animate, style, transition, trigger} from '@angular/animations';
import {TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('enterLeaveSmooth', [
      transition(':enter', [
        style({opacity: 0, transform: 'scale(0.9)'}),
        animate(50, style({opacity: 1, transform: 'scale(1)'})),
      ]),
      transition(':leave', [animate(100, style({opacity: 0}))]),
    ]),
  ],
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() placeHolder? = 'Search on the list';
  @Input() imageDir? = '../../../../../assets/images/magnifier.png';
  @Input() imageClose? = '../../../../../assets/images/close.png';
  @Output() send = new EventEmitter();
  timeout: any = null;
  @ViewChild('search') inputSearch;
  showClose = false;
  notShowTable = false;
  @Input() showListSearch = false;
  @Input() listSearchItems = [];
  @Output() clickSearchItem = new Subject<any>();
  @Input() value: string;
  @Input() darkMode: boolean;
  isQueryMode: boolean = false;
  positionHelpPopup: ConnectedPosition[] = new Array<ConnectedPosition>();
  isOpenHelpPopup: boolean = false;
  helpIconGray: string = '../../../../../assets/images/help_icon.svg';
  helpIconBlue: string = '../../../../../assets/images/help_icon_blue.svg';
  helpIconDark: string = '../../../../../assets/images/help_icon_dark.svg';

  @Input() error: boolean = false;
  @Input() errorMessage: string = '';
  options = [];
  control = new FormControl();
  indexCaretPositionStart: number;
  indexCaretPositionEnd: number = 0;
  isFilteringOption: boolean = false;
  selectedAutocompleteOptionByEnter: boolean = false;
  activatedLabelAutocomplete: string;
  searchOptionsSubscription: Subscription;
  @Output() loadMoreMipSuggestions: Subject<boolean> = new Subject<boolean>();
  @Input() loadingMipsSuggestions: boolean = false;
  format: IFormatting[] = [
    {
      pattern: /and\(/gi,
      replace: '<span style=\'font-weight:bold;\'>AND</span>(',
    },
    {
      pattern: /or\(/gi,
      replace: '<span style=\'font-weight:bold;\'>OR</span>(',
    },
    {
      pattern: /not\(/gi,
      replace: '<span style=\'font-weight:bold;\'>NOT</span>(',
    },
    {
      pattern: /@accepted/gi,
      replace: '@<span style=\'font-weight:500;color:#27AE60\'>ACCEPTED</span>',
    },
    {
      pattern: /@rejected/gi,
      replace: '@<span style=\'font-weight:500;color:#EB5757\'>REJECTED</span>',
    },
    {
      pattern: /@rfc/gi,
      replace: '@<span style=\'font-weight:500;color:#F2994A\'>RFC</span>',
    },
    {
      pattern: /@archive/gi,
      replace: '@<span style=\'font-weight:500;color:#748AA1\'>ARCHIVE</span>',
    },
    {
      pattern: /@obsolete/gi,
      replace: '@<span style=\'font-weight:500;color:#CBAB48\'>OBSOLETE</span>',
    },
    {
      pattern: /@Formal\sSubmission/gi,
      replace:
        '@<span style=\'font-weight:500;color:#9B51E0\'>FORMAL SUBMISSION</span>',
    },
    {
      pattern: /@proposed/gi,
      replace: '@<span style=\'font-weight:500;color:#8B4513\'>PROPOSED</span>',
    },
    {
      pattern: /@withdrawn/gi,
      replace: '@<span style=\'font-weight:500;color:#8B4513\'>WITHDRAWN</span>',
    },
  ];
  private overlayRef: OverlayRef;
  @ViewChild('mipsSugestions') mipsSugestions: TemplateRef<any>;
  @ViewChild('textBoxWrapper') textBoxWrapper: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private smartSearchService: SmartSearchService,
    private overlay: Overlay,
    public viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    if (this.darkMode) {
      this.format = this.format.map((item) => {
        if (item.pattern.source === '@rfc') {
          return {
            ...item,
            replace: item.replace.replace('#F2994A', '#FFBA88'),
          };
        } else {
          return item;
        }
      });
    }

    this.control.setValue(this.value);
    this.showClose = !!this.value;
    this.initPositionHelpPopup();
  }

  ngAfterViewInit() {
    (this.inputSearch.nativeElement as HTMLElement).setAttribute(
      'placeholder',
      this.placeHolder
    );

    this.isQueryMode = this.isQuery(this.value);
    this.cdr.detectChanges();
    this.initMipSuggestions();

    if (this.control.value) {
      const div = this.inputSearch.nativeElement;
      const s = window.getSelection();
      const r = document.createRange();
      const e = div.childElementCount > 0 ? div.lastChild : div;
      r.setStart(e, 1);
      r.setEnd(e, 1);
      s.removeAllRanges();
      s.addRange(r);
    }




  }

  onClickCE(event:MouseEvent){
    alert('CLICKED');
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'listSearchItems') {
        const chng = changes[propName];

        if (
          ((chng.currentValue?.length && !chng.previousValue?.length) ||
            (!chng.currentValue?.length && chng.previousValue?.length)) &&
          this.overlayRef &&
          !this.overlayRef?.hasAttached()
        ) {
          this.onDisplayMipsSugestion();
        }

        if (!this.listSearchItems.length) {
          this.overlayRef?.detach();
        }
      }
    }
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
      let val: string = this.control.value;

      if (this.inputSearch.nativeElement.constructor !== HTMLInputElement) {
        val = (this.inputSearch.nativeElement as HTMLElement).innerText;
      }

      this.showClose = !!(val.replace("\n",""));

      if (this.isQuery(val)) {
        this.isQueryMode = true;

        if (event.keyCode === 13 && !this.selectedAutocompleteOptionByEnter) {
          if (
            this.inputSearch.nativeElement.constructor === HTMLInputElement
          ) {
            this.send.emit(event);
          } else {
            event.target.value = (
              this.inputSearch.nativeElement as HTMLElement
            ).innerText;
            this.send.emit(event);
          }
        } else {
          this.selectedAutocompleteOptionByEnter = false;
          this.filteringOptions();
        }
      } else {
        this.options = [];
        this.isQueryMode = false;

        this.timeout = setTimeout(() => {
          if (this.inputSearch.nativeElement.constructor === HTMLInputElement) {
            this.send.emit(event);
          } else {
            event.target.value = (this.inputSearch
              .nativeElement as HTMLElement).innerText;
            this.send.emit(event);
          }
        }, 1000);
      }
    }
  }

  isQuery(data: string): boolean {
    if (data) {
      const search = data.toLowerCase().trim();
      return search.startsWith('$');
    }

    return false;
  }

  clear(): void {
    this.showClose = false;
    this.control.setValue('');

    const searchBox = this.inputSearch.nativeElement;
    setTimeout(() => {
      searchBox.tabIndex = 0;
      searchBox.focus();
    }, 0);
    const event = new Event('keyup');
    Object.defineProperty(event, 'keyCode', {
      get : () => 13
    });
    this.inputSearch.nativeElement.dispatchEvent(event);
  }

  onClickSearchItem(element) {
    setTimeout(() => {
      this.clickSearchItem.next(element);
    }, 100);
    this.notShowTable = true;
  }

  onClickOutside(ev: MouseEvent) {
    ev.stopPropagation();
    this.isOpenHelpPopup = false;
  }

  searchAutocompleteOptions(event: any): void {
    this.options = [];
    this.cdr.detectChanges();

    if (event === '@') {
      this.indexCaretPositionStart = position(
        this.inputSearch.nativeElement
      ).pos;
      this.isFilteringOption = true;

      this.searchOptionsSubscription = this.control.valueChanges
        .pipe(debounceTime(10))
        .subscribe((value) => {
          this.indexCaretPositionEnd = position(
            this.inputSearch.nativeElement
          ).pos;

          const search: string = (
            this.inputSearch.nativeElement as HTMLElement
          ).innerText.slice(
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
                    return {label: i.status};
                  });

                return newArray;
              })
            )
            .subscribe((data: any) => {
              this.options = (data as []).sort(function(a: any, b: any) {
                return a.label < b.label ? -1 : 1;
              });
              this.cdr.detectChanges();
            });
        });

      let search: string;

      if (this.inputSearch.nativeElement.constructor === HTMLInputElement) {
        search = this.control.value.slice(
          this.indexCaretPositionStart,
          this.indexCaretPositionEnd
        );
      } else {
        search = (
          this.inputSearch.nativeElement as HTMLElement
        ).innerText.slice(
          this.indexCaretPositionStart,
          this.indexCaretPositionEnd
        );
      }

      this.smartSearchService
        .getOptions('status', search)
        .pipe(
          map((data) => {
            const newArray = (data as [])
              .filter((i: any) => i.status !== '')
              .map((i: any) => {
                return {label: i.status};
              });

            return newArray;
          })
        )
        .subscribe((data: any) => {
          this.options = (data as []).sort(function(a: any, b: any) {
            return a.label < b.label ? -1 : 1;
          });
          this.cdr.detectChanges();
        });
    } else if (event === '#') {
      this.indexCaretPositionStart = position(
        this.inputSearch.nativeElement
      ).pos;
      this.isFilteringOption = true;

      this.searchOptionsSubscription = this.control.valueChanges
        .pipe(debounceTime(200))
        .subscribe((value) => {
          this.indexCaretPositionEnd = position(
            this.inputSearch.nativeElement
          ).pos;

          const search: string = (
            this.inputSearch.nativeElement as HTMLElement
          ).innerText.slice(
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
                    return {label: i.tag};
                  });

                return newArray;
              })
            )
            .subscribe((data: any) => {
              this.options = (data as []).sort(function(a: any, b: any) {
                return a.label < b.label ? -1 : 1;
              });
              this.cdr.detectChanges();
            });
        });

      let search: string;

      if (this.inputSearch.nativeElement.constructor === HTMLInputElement) {
        search = this.control.value.slice(
          this.indexCaretPositionStart,
          this.indexCaretPositionEnd
        );
      } else {
        search = (
          this.inputSearch.nativeElement as HTMLElement
        ).innerText.slice(
          this.indexCaretPositionStart,
          this.indexCaretPositionEnd
        );
      }

      this.smartSearchService
        .getOptions('tags', search)
        .pipe(
          map((data) => {
            const newArray = (data as [])
              .filter((i: any) => i.tag !== '')
              .map((i: any) => {
                return {label: i.tag};
              });

            return newArray;
          })
        )
        .subscribe((data: any) => {
          this.options = (data as []).sort(function(a: any, b: any) {
            return a.label < b.label ? -1 : 1;
          });
          this.cdr.detectChanges();
        });
    }
  }

  onClosedOptionsAutocomplete() {
    this.searchOptionsSubscription?.unsubscribe();
  }

  filteringOptions() {
    if (this.isFilteringOption) {
      this.indexCaretPositionEnd = position(this.inputSearch.nativeElement).pos;
    }
  }

  getAutocompleteOptionStyle(value: string): any {
    const val: string = value.toLowerCase();
    const style: any = {
      color: '#00000',
    };

    switch (val) {
      case 'accepted':
        style.color = this.darkMode ? '#5BDA90' : '#27AE60';
        break;
      case 'rejected':
        style.color = this.darkMode ? '#FD8787' : '#EB5757';
        break;
      case 'rfc':
        style.color = this.darkMode ? '#FFBA88' : '#F2994A';
        break;
      case 'obsolete':
        style.color = this.darkMode ? '#B5B12A' : '#CBAB48';
        break;
      case 'formal submission':
        style.color = this.darkMode ? '#9B51E0' : '#9B51E0';
        break;
      case 'archive':
        style.color = this.darkMode ? '#748AA1' : '#748AA1';
        break;
      case 'proposed':
        style.color = '#8B4513';
        break;
      case 'withdrawn':
        style.color = this.darkMode ? '#8B4513' : '#8B4513';
        break;

      default:
        break;
    }

    return style;
  }

  onLoadMoreMipSugestions() {
    this.loadMoreMipSuggestions.next();
  }

  initMipSuggestions() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.textBoxWrapper)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);
    const width = (
      this.textBoxWrapper.nativeElement as HTMLDivElement
    ).getBoundingClientRect().width;
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      width: width,
      minWidth: width,
    });
  }

  onDisplayMipsSugestion() {
    const template = new TemplatePortal(
      this.mipsSugestions,
      this.viewContainerRef
    );
    this.overlayRef.attach(template);
    const widthTextBoxWrapper = (this.textBoxWrapper
      .nativeElement as HTMLDivElement).getBoundingClientRect().width;
    this.overlayRef.updateSize({ width: widthTextBoxWrapper });

    overlayClickOutside(
      this.overlayRef,
      this.textBoxWrapper.nativeElement
    ).subscribe(() => {
      this.overlayRef.detach();
    });
  }

  @HostListener('document:keydown.escape') onEscape() {
    this.options = [];
    this.overlayRef.detach();
    this.cdr.detectChanges();
  }

  onPaste($event: ClipboardEvent) {
      $event.preventDefault();
      const text = $event.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}

export function overlayClickOutside(
  overlayRef: OverlayRef,
  origin: HTMLElement
) {
  return fromEvent<MouseEvent>(document, 'click').pipe(
    filter((event) => {
      const clickTarget = event.target as HTMLElement;
      const notOrigin = clickTarget !== origin;
      const notOverlay =
        !!overlayRef &&
        overlayRef.overlayElement.contains(clickTarget) === false;
      return notOrigin && notOverlay;
    }),
    takeUntil(overlayRef.detachments())
  );
}
