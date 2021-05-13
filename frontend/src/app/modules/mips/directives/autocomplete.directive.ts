import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategyOrigin,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AutocompleteComponent } from '../components/autocomplete/autocomplete.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
var getCaretCoordinates = require('textarea-caret');

@Directive({
  selector: '[appAutocomplete]',
})
export class AutocompleteDirective {
  @Input() appAutocomplete: AutocompleteComponent;
  private overlayRef: OverlayRef;
  @Input() showAutocompleteContent: boolean = false;
  top: number;
  left: number;
  indexCaretPosition: number;
  indexCaretPositionStart: number;
  indexCaretPositionEnd: number;

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
    private vcr: ViewContainerRef,
    private overlay: Overlay
  ) {}

  get control() {
    return this.ngControl.control;
  }

  get origin() {
    return this.host.nativeElement;
  }

  ngOnInit() {
    // fromEvent(this.origin, 'focus')
    //   .pipe(untilDestroyed(this))
    //   .subscribe(() => {
    //     this.openDropdown();

    //     this.appAutocomplete
    //       .optionsClick()
    //       .pipe(takeUntil(this.overlayRef.detachments()))
    //       .subscribe((value: string) => {
    //         this.control.setValue(value);
    //         this.close();
    //       });
    //   });
    // setTimeout(() => {
    //   if (this.showAutocompleteContent) {
    //     this.showContent();
    //   }
    // }, 3000);
    fromEvent(this.host.nativeElement, 'keyup')
      .pipe(untilDestroyed(this))
      .subscribe((ev: any) => {
        // console.log('input', ev);
        // console.log(
        //   'event',
        //   (this.host.nativeElement as HTMLInputElement).selectionStart
        // );
        this.indexCaretPosition = (this.host
          .nativeElement as HTMLInputElement).selectionStart;
        // console.log('event', (this.host.nativeElement as HTMLInputElement));

        // if (this.showAutocompleteContent) {
        //   this.showContent();
        // }
        if (ev.key === '@' || ev.key === '#') {
          // console.log('@ || #');
          this.indexCaretPositionStart = (this.host
            .nativeElement as HTMLInputElement).selectionStart;
          console.log('indexCaretPositionStart', this.indexCaretPositionStart);
          this.showContent();
        } else {
          this.indexCaretPositionEnd = (this.host
            .nativeElement as HTMLInputElement).selectionEnd;
          console.log('indexCaretPositionEnd', this.indexCaretPositionEnd);
        }
      });

    fromEvent(this.host.nativeElement, 'input')
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        var caret = getCaretCoordinates(
          this.host.nativeElement as HTMLInputElement,
          (this.host.nativeElement as HTMLInputElement).selectionEnd - 1
        );
        // console.log(
        //   '(top, left, height) = (%s, %s, %s)',
        //   caret.top,
        //   caret.left,
        //   caret.height
        // );
        this.top = caret.top;
        this.left = caret.left;
      });
    // (this.host.nativeElement as HTMLInputElement).addEventListener('input', function () {
    //   var caret = getCaretCoordinates(this, this.selectionEnd);
    //   console.log('(top, left, height) = (%s, %s, %s)', caret.top, caret.left, caret.height);
    // })

    // fromEvent(this.host.nativeElement, 'click')
    //   .pipe(untilDestroyed(this))
    //   .subscribe((ev: MouseEvent) => {
    //     console.log('ev', ev);
    //     let ev2: MouseEvent = { ...ev, x: 10, y: 300 };
    //     console.log('ev2', ev2);
    //     let ev3: MouseEvent = new MouseEvent('click', {
    //       screenX: 10,
    //       screenY: 50,
    //     });
    //     console.log('ev3', ev3);
    //   });
  }

  showContent() {
    this.openDropdown();

    this.appAutocomplete
      .optionsClick()
      .pipe(takeUntil(this.overlayRef.detachments()))
      .subscribe((value: string) => {
        let newValue: Array<string> = (this.host
          .nativeElement as HTMLInputElement).value
          .slice(0)
          .split('');
        newValue.splice(
          this.indexCaretPositionStart,
          this.indexCaretPositionEnd - this.indexCaretPositionStart,
          value
        );
        this.control.setValue(newValue.join(''));
        this.close();
      });
  }

  openDropdown() {
    this.overlayRef = this.overlay.create({
      width: this.origin.offsetWidth,
      maxHeight: 40 * 3,
      backdropClass: '',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.getOverlayPosition(),
    });

    const template = new TemplatePortal(
      this.appAutocomplete.rootTemplate,
      this.vcr
    );
    this.overlayRef.attach(template);

    overlayClickOutside(this.overlayRef, this.origin).subscribe(() =>
      this.close()
    );
  }

  private close() {
    this.overlayRef.detach();
    this.overlayRef = null;
  }

  private getOverlayPosition() {
    const positions = [
      new ConnectionPositionPair(
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' }
      ),
      new ConnectionPositionPair(
        { originX: 'start', originY: 'top' },
        { overlayX: 'start', overlayY: 'bottom' }
      ),
    ];

    // let posStrategy: FlexibleConnectedPositionStrategyOrigin = new HTMLElement();
    // let mouseEvent = new MouseEvent('');
    let ev3: MouseEvent = new MouseEvent('click', { screenX: 10, screenY: 50 });
    // console.log('ev3', ev3);
    let ev2: MouseEvent = {
      ...ev3,
      x:
        (this.host.nativeElement as HTMLElement).getClientRects()[0].left +
        this.left,
      y:
        (this.host.nativeElement as HTMLElement).getClientRects()[0].top +
        this.top +
        14,
    };
    // console.log(
    //   'rect',
    //   (this.host.nativeElement as HTMLElement).getClientRects()
    // );

    return (
      this.overlay
        .position()
        // .flexibleConnectedTo(this.origin)
        .flexibleConnectedTo(ev2)
        .withPositions(positions)
        .withFlexibleDimensions(false)
        .withPush(false)
    );
  }

  ngOnDestroy() {}
}

export function overlayClickOutside(
  overlayRef: OverlayRef,
  origin: HTMLElement
) {
  return fromEvent<MouseEvent>(document, 'click').pipe(
    filter((event) => {
      const clickTarget = event.target as HTMLElement;
      const notOrigin = clickTarget !== origin; // the input
      const notOverlay =
        !!overlayRef &&
        overlayRef.overlayElement.contains(clickTarget) === false; // the autocomplete
      return notOrigin && notOverlay;
    }),
    takeUntil(overlayRef.detachments())
  );
}
