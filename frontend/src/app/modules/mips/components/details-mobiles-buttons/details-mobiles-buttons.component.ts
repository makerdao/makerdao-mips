import { animate, style, transition, trigger } from '@angular/animations';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-mobiles-buttons',
  templateUrl: './details-mobiles-buttons.component.html',
  styleUrls: ['./details-mobiles-buttons.component.scss'],
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
export class DetailsMobilesButtonsComponent implements OnInit {
  open = false;
  openMore = false;
  selected = 1;
  @Input() sourceData;
  @Input() mip;
  positionPopup: ConnectedPosition[] = new Array<ConnectedPosition>();
  active: string;

  constructor() {}

  ngOnInit(): void {
    this.initPositionPopup();
  }

  initPositionPopup() {
    this.positionPopup = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
    ];
  }

  scrollTo(id?: string) {
    if (id) {
      const elem = document.querySelector('#' + id);

      if (elem) {
        elem.scrollIntoView();
      }
    }

    this.closePopup();
  }

  closePopup() {
    this.open = false;
    this.openMore = false;
  }

  onClickOutside(ev: MouseEvent) {
    ev.stopPropagation();
    this.closePopup();
  }
}
