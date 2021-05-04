import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { AutocompleteComponent } from '../modules/mips/components/autocomplete/autocomplete.component';

@Directive({
  selector: '[appAutocomplete]'
})
export class AutocompleteDirective {
  @Input() appAutocomplete: AutocompleteComponent;
  private overlayRef: OverlayRef;

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
    private vcr: ViewContainerRef,
    private overlay: Overlay) { }

    get control() {
      return this.ngControl.control;
    }

    get origin() {
      return this.host.nativeElement;
    }

    ngOnInit() {
      fromEvent(this.origin, 'focus').pipe(
        untilDestroyed(this)
      ).subscribe(() => {
        this.openDropdown();
      }
    }

    openDropdown() {
      this.overlayRef = this.overlay.create({
        width: this.origin.offsetWidth,
        maxHeight: 40 * 3,
        backdropClass: '',
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        positionStrategy: this.getOverlayPosition()
      });

      const template = new TemplatePortal(this.appAutocomplete.rootTemplate, this.vcr);
      this.overlayRef.attach(template);
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
        )
      ];

      return this.overlay
        .position()
        .flexibleConnectedTo(this.origin)
        .withPositions(positions)
        .withFlexibleDimensions(false)
        .withPush(false);
    }

}
