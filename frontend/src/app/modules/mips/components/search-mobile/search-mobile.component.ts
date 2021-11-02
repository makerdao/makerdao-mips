import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
  HostBinding,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  SimpleChanges,
  TemplateRef,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { SmartSearchService } from '../../services/smart-search.service';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import IFormatting from '../../types/formatting';
import { position } from 'caret-pos';
import { animate, style, transition, trigger } from '@angular/animations';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-search-mobile',
  templateUrl: './search-mobile.component.html',
  styleUrls: ['./search-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('enterLeaveSmooth', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate(50, style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [animate(100, style({ opacity: 0 }))]),
    ]),
  ],
})
export class SearchMobileComponent implements OnInit {
  @Input() placeHolder? = 'Search on the list';
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
  @Input() darkMode:boolean = false;
  options = [];
  control = new FormControl();
  indexCaretPositionStart: number;
  indexCaretPositionEnd: number;
  isFilteringOption: boolean = false;
  selectedAutocompleteOptionByEnter: boolean = false;
  activatedLabelAutocomplete: string;
  searchOptionsSubscription: Subscription;
  @Output() loadMoreMipSuggestions: Subject<boolean> = new Subject<boolean>();
  @Input() loadingMipsSuggestions: boolean = false;
  format: IFormatting[] = [
    {
      pattern: /and\(/gi,
      replace: "<span style='font-weight:bold;'>AND</span>(",
    },
    {
      pattern: /or\(/gi,
      replace: "<span style='font-weight:bold;'>OR</span>(",
    },
    {
      pattern: /not\(/gi,
      replace: "<span style='font-weight:bold;'>NOT</span>(",
    },
    {
      pattern: /@accepted/gi,
      replace: "@<span style='font-weight:500;color:#27AE60'>Accepted</span>",
    },
    {
      pattern: /@rejected/gi,
      replace: "@<span style='font-weight:500;color:#EB5757'>Rejected</span>",
    },
    {
      pattern: /@rfc/gi,
      replace: "@<span style='font-weight:500;color:#F2994A'>RFC</span>",
    },
    {
      pattern: /@archive/gi,
      replace: "@<span style='font-weight:500;color:#748AA1'>Archive</span>",
    },
    {
      pattern: /@obsolete/gi,
      replace: "@<span style='font-weight:500;color:#CBAB48'>Obsolete</span>",
    },
    {
      pattern: /@Formal\sSubmission/gi,
      replace:
        "@<span style='font-weight:500;color:#9B51E0'>Formal Submission</span>",
    },
    {
      pattern: /@proposed/gi,
      replace: "@<span style='font-weight:500;color:#8B4513'>Proposed</span>",
    },
    {
      pattern: /@withdrawn/gi,
      replace: "@<span style='font-weight:500;color:#8B4513'>Withdrawn</span>",
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
  ) {}

  ngOnInit(): void {
    this.control.setValue(this.value);
    this.showClose = this.value ? true : false;
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

      if (this.isQuery(val)) {
        this.isQueryMode = true;
        this.showClose = false;

        if (event.keyCode == 13 && !this.selectedAutocompleteOptionByEnter) {
          this.timeout = setTimeout(() => {
            if (
              this.inputSearch.nativeElement.constructor === HTMLInputElement
            ) {
              this.send.emit(event);
            } else {
              event.target.value = (this.inputSearch
                .nativeElement as HTMLElement).innerText;
              this.send.emit(event);
            }
          }, 1000);
        } else {
          this.selectedAutocompleteOptionByEnter = false;
          this.filteringOptions();
        }
      } else {
        this.options = [];
        this.isQueryMode = false;

        if (this.inputSearch.nativeElement.constructor === HTMLInputElement) {
          this.showClose =
            this.inputSearch.nativeElement.value === '' ? false : true;
        } else {
          this.showClose =
            (this.inputSearch.nativeElement as HTMLElement).innerText === ''
              ? false
              : true;
        }

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
      let search = data.toLowerCase().trim();

      return search.startsWith('$');
    }

    return false;
  }

  clear(): void {
    this.showClose = false;
    this.control.setValue('');
    this.text = '';
    let event = new Event('keyup');
    this.inputSearch.nativeElement.dispatchEvent(event);
    this.onOpenCloseInput();
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

          const search: string = (this.inputSearch
            .nativeElement as HTMLElement).innerText.slice(
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

      let search: string;

      if (this.inputSearch.nativeElement.constructor === HTMLInputElement) {
        search = this.control.value.slice(
          this.indexCaretPositionStart,
          this.indexCaretPositionEnd
        );
      } else {
        search = (this.inputSearch
          .nativeElement as HTMLElement).innerText.slice(
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

          const search: string = (this.inputSearch
            .nativeElement as HTMLElement).innerText.slice(
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

      let search: string;

      if (this.inputSearch.nativeElement.constructor === HTMLInputElement) {
        search = this.control.value.slice(
          this.indexCaretPositionStart,
          this.indexCaretPositionEnd
        );
      } else {
        search = (this.inputSearch
          .nativeElement as HTMLElement).innerText.slice(
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
        style.color = '#27AE60';
        break;
      case 'rejected':
        style.color = '#EB5757';
        break;
      case 'rfc':
        style.color = '#F2994A';
        break;
      case 'obsolete':
        style.color = '#CBAB48';
        break;
      case 'formal submission':
        style.color = '#9B51E0';
        break;
      case 'archive':
        style.color = '#748AA1';
        break;
      case 'proposed':
        style.color = '#8B4513';
        break;
      case 'withdrawn':
        style.color = '#8B4513';
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
      ])
      .withFlexibleDimensions(true);
    const width = (this.textBoxWrapper
      .nativeElement as HTMLDivElement).getBoundingClientRect().width;

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
