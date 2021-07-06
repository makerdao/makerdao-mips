import {
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { merge, Subject } from 'rxjs/index';
import { OptionAutocompleteComponent } from '../option-autocomplete/option-autocomplete.component';
import { AutocompleteContentDirective } from '../../directives/autocomplete-content.directive';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  exportAs: 'appAutocomplete',
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
  @ViewChild('root') rootTemplate: TemplateRef<any>;

  @ContentChild(AutocompleteContentDirective)
  content: AutocompleteContentDirective;

  @ContentChildren(OptionAutocompleteComponent) options: QueryList<
    OptionAutocompleteComponent
  >;

  @Input() labels: string[] = [];
  focusIndex: number = 0;
  @Output() enter: Subject<boolean> = new Subject<boolean>();
  @Output() activatedLabel: Subject<string> = new Subject<string>();
  @ViewChild('autocomplete') autocompleteRef: ElementRef;
  maxVisibleOptions: number = 6;
  topOptionIndex: number = 0;
  ITEM_OPTION_HEIGHT: number = 25;
  showOptions: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.options.changes.subscribe((data) => {
      if (this.options.length > 0) {
        this.topOptionIndex = 0;
        this.focusIndex = 0;

        this.options.toArray().forEach((item, index) => {
          let child: Element = (item.element as HTMLElement).children.item(0);

          if (index === this.focusIndex) {
            child.classList.add('focusOption');
            (child as HTMLElement).focus();
          } else {
            child.classList.remove('focusOption');
          }
        });
      }
    });
  }

  optionsClick() {
    return this.options.changes.pipe(
      switchMap((options) => {
        const clicks$ = options.map((option) => option.click$);
        return merge(...clicks$);
      })
    );
  }

  @HostListener('document:keydown.ArrowDown', ['$event'])
  onArrowDown(event: KeyboardEvent) {
    event.preventDefault();
    let size: number = this.options.length;
    this.focusIndex = (size + ++this.focusIndex) % size;

    this.options.toArray().forEach((item, index) => {
      let child: Element = (item.element as HTMLElement).children.item(0);

      if (index === this.focusIndex) {
        child.classList.add('focusOption');
      } else {
        child.classList.remove('focusOption');
      }
    });

    if (this.focusIndex >= this.topOptionIndex + this.maxVisibleOptions) {
      (this.autocompleteRef.nativeElement as HTMLElement).scrollBy(
        0,
        this.ITEM_OPTION_HEIGHT
      );
      this.topOptionIndex++;
    }

    if (this.focusIndex === 0) {
      (this.autocompleteRef.nativeElement as HTMLElement).scrollTo(0, 0);
      this.topOptionIndex = 0;
    }
  }

  @HostListener('document:keydown.ArrowUp', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    event.preventDefault();
    let size: number = this.options.length;
    this.focusIndex = (size + --this.focusIndex) % size;

    this.options.toArray().forEach((item, index) => {
      let child: Element = (item.element as HTMLElement).children.item(0);

      if (index === this.focusIndex) {
        child.classList.add('focusOption');
      } else {
        child.classList.remove('focusOption');
      }
    });

    if (this.focusIndex < this.topOptionIndex) {
      (this.autocompleteRef.nativeElement as HTMLElement).scrollBy(
        0,
        -this.ITEM_OPTION_HEIGHT
      );
      this.topOptionIndex--;
    }

    if (this.focusIndex === this.options.length - 1) {
      const yPos: number =
        (this.options.length - this.maxVisibleOptions) *
        this.ITEM_OPTION_HEIGHT;
      (this.autocompleteRef.nativeElement as HTMLElement).scrollTo(0, yPos);
      this.topOptionIndex = this.options.length - this.maxVisibleOptions;
    }
  }

  @HostListener('document:keydown.Enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (this.options.length > 0) {
      this.enter.next();
    }

    this.options.toArray()[this.focusIndex]?.element.click();
  }

  ngAfterViewChecked() {
    if (this.autocompleteRef?.nativeElement && this.focusIndex === 0) {
      this.showOptions.next();
      (this.autocompleteRef.nativeElement as HTMLElement).scrollTo(0, 0);
    }
  }
}
