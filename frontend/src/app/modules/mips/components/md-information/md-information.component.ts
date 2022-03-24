import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { MdTooltipDirective } from '../../directives/md-tooltip.directive';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-md-information',
  templateUrl: './md-information.component.html',
  styleUrls: ['./md-information.component.scss']
})
export class MdInformationComponent implements AfterViewInit {
 

  @Input() additionalInformation: any[] = [];

  activeIcon = false;
  @ViewChild(MdTooltipDirective) tooltip: MdTooltipDirective;
  scrollSubcription: Subscription;
  startTime: number;
  endTime: number;

  constructor(
    private cdr: ChangeDetectorRef,
    private statusService: StatusService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  onClickIcon() {
    this.endTime = new Date().getTime();
    let timeInterval = this.endTime - this.startTime;

    if (this.activeIcon && timeInterval > 90) {
      this.activeIcon = false;
      this.hideTooltip();
    } else if (!this.activeIcon) {
      this.activeIcon = true;
      this.showTooltip();
    }

    this.cdr.detectChanges();
  }

  onMouseenterIcon() {
    this.startTime = new Date().getTime();
    this.activeIcon = true;
    this.showTooltip();
  }

  onMouseleaveIcon() {
    this.activeIcon = false;
    this.hideTooltip();
  }

  showTooltip() {
    this.tooltip.show();
    this.cdr.detectChanges();
    this.eventScroll();
  }

  hideTooltip() {
    this.tooltip.hide();
    this.cdr.detectChanges();
    this.cleanSubscription();
  }

  eventScroll() {
    this.scrollSubcription = fromEvent(window, 'scroll').subscribe((_) => {
      this.activeIcon = false;
      this.cdr.detectChanges();
    });
  }

  cleanSubscription() {
    this.scrollSubcription.unsubscribe();
  }

  getStatusValue(data: string): string {
    return this.statusService.getStatusValue(data);
  }

  getStatusType(data: string): string {
    return this.statusService.getStatusType(data);
  }
}
