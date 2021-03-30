import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appFilterListHost]'
})
export class FilterListHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
