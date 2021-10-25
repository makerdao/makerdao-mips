import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-md-tooltip',
  templateUrl: './md-tooltip.component.html',
  styleUrls: ['./md-tooltip.component.scss'],
  animations: [
    trigger('mdtooltip', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate(50, style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [animate(100, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MdTooltipComponent implements OnInit {
  @Input() text = '';

  constructor(public darkModeService:DarkModeService) {}

  ngOnInit(): void {}
}
