import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-subproposals',
  templateUrl: './subproposals.component.html',
  styleUrls: ['./subproposals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubproposalsComponent implements OnInit {
  @Input() subproposals: any[] = [];
  panelOpenState: boolean = false;
  @ViewChild('expansionPanel') expansionPanel;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onToggleShowMore() {
    this.expansionPanel.toggle();
    this.cdr.detectChanges();
  }
}
