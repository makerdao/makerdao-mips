import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-option-autocomplete',
  templateUrl: './option-autocomplete.component.html',
  styleUrls: ['./option-autocomplete.component.scss'],
})
export class OptionAutocompleteComponent implements OnInit {
  @Input() value: string;
  click$: Observable<string>;

  constructor(private host: ElementRef) {}

  ngOnInit() {
    this.click$ = fromEvent(this.element, 'click').pipe(mapTo(this.value));
  }

  get element() {
    return this.host.nativeElement;
  }
}
