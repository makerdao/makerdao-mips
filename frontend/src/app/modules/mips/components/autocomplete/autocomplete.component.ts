import {
  Component,
  ContentChild,
  ContentChildren,
  Input,
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
export class AutocompleteComponent implements OnInit {
  @ViewChild('root') rootTemplate: TemplateRef<any>;

  @ContentChild(AutocompleteContentDirective)
  content: AutocompleteContentDirective;

  @ContentChildren(OptionAutocompleteComponent) options: QueryList<
    OptionAutocompleteComponent
  >;

  @Input() labels: string[] = [];

  ngOnInit() {}

  optionsClick() {
    return this.options.changes.pipe(
      switchMap((options) => {
        const clicks$ = options.map((option) => option.click$);
        return merge(...clicks$);
      })
    );
  }
}
