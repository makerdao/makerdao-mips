import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
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
  @ViewChild('topElementRef') topElementRef: ElementRef;
  private isVisible = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onToggleShowMore() {
    this.expansionPanel.toggle();
    this.cdr.detectChanges();
    if (!this.panelOpenState && !this.isVisible) {
      this.topElementRef.nativeElement.scrollIntoView();
    }
  }

  onVisible(value: boolean) {
    this.isVisible = value;
  }
}
