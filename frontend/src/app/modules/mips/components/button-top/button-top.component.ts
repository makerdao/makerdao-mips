import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-button-top',
  templateUrl: './button-top.component.html',
  styleUrls: ['./button-top.component.scss'],
  animations: [
    trigger('slide', [
      state('hidden', style({ right: '-64px' })),
      state('visible', style({ right: '10px' })),
      transition(
        'hidden <=> visible',
        animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ButtonTopComponent implements OnInit, AfterViewInit {
  scrolled = false;
  @ViewChild(MatButton) scrollTopButton: MatButton;
  subscriptionScroll = new Subscription();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.scrollTopButton.ripple.color = 'rgba(47, 128, 237, 0.5)';
    this.scrollTopButton.ripple.centered = true;

    this.subscriptionScroll = fromEvent(window, 'scroll').subscribe((e) => {
      if (document.documentElement.scrollTop === 0) {
        this.scrolled = false;
      } else {
        this.scrolled = true;
      }
    });
  }

  scrollToTop() {
    document.body.scrollIntoView({ behavior: 'smooth' });
  }
}
