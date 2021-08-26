import { Directive, ElementRef, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appMdObserveVisibility]',
})
export class MdObserveVisibilityDirective {
  @Output() visible = new Subject<boolean>();
  private intersectionObserver?: IntersectionObserver;

  constructor(private element: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    let options = {
      rootMargin: '0px',
      threshold: 0,
    };
    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.checkForIntersection(entries);
    }, options);
    this.intersectionObserver.observe(<Element>this.element.nativeElement);
  }

  private checkForIntersection = (
    entries: Array<IntersectionObserverEntry>
  ) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (this.checkIfIntersecting(entry)) {
        this.visible.next(true);
      } else {
        this.visible.next(false);
      }
    });
  };

  private checkIfIntersecting(entry: IntersectionObserverEntry) {
    return (
      (<any>entry).isIntersecting && entry.target === this.element.nativeElement
    );
  }
}
