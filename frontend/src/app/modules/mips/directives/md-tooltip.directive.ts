import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { MdTooltipComponent } from '../components/md-tooltip/md-tooltip.component';

@Directive({
  selector: '[appMdTooltip]',
  exportAs: 'appMdTooltip',
})
export class MdTooltipDirective implements OnInit {
  @Input('appMdTooltip') text = '';
  private overlayRef: OverlayRef;
  startTime: number;
  endTime: number;

  constructor(private overlay: Overlay, private host: ElementRef) {}

  ngOnInit() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
  }

  @HostListener('mouseenter')
  onMouseenter() {
    this.startTime = new Date().getTime();

    if (!this.overlayRef.hasAttached()) {
      this.show();
    }
  }

  @HostListener('mouseleave')
  onMouseleave() {
    if (this.overlayRef.hasAttached()) {
      this.hide();
    }
  }

  toggle() {
    this.endTime = new Date().getTime();
    let timeInterval = this.endTime - this.startTime;

    if (this.overlayRef.hasAttached() && timeInterval > 90) {
      this.hide();
    } else if (!this.overlayRef.hasAttached()) {
      this.show();
    }
  }

  hide() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  show() {
    if (!this.overlayRef.hasAttached()) {
      const tooltipPortal = new ComponentPortal(MdTooltipComponent);
      const tooltipRef: ComponentRef<MdTooltipComponent> = this.overlayRef.attach(
        tooltipPortal
      );
      tooltipRef.instance.text = this.text;
    }
  }
}
