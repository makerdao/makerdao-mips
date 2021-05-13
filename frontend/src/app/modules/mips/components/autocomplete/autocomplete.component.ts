import {
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs/index';
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

  ngOnInit() {}

  ngAfterViewInit() {
    console.log('rootTemplate', this.rootTemplate.elementRef.nativeElement);
    fromEvent(this.rootTemplate.elementRef.nativeElement, 'load').subscribe(() => {
      console.log('loaded');
    });

    (this.rootTemplate.elementRef.nativeElement as HTMLElement).onload = () => {
      console.log('wwwwwwwww');

    };

    setTimeout(() => {
      console.log('root', this.rootTemplate.elementRef);

    }, 10000);
  }

  optionsClick() {
    return this.options.changes.pipe(
      switchMap((options) => {
        const clicks$ = options.map((option) => option.click$);
        return merge(...clicks$);
      })
    );
  }
}
