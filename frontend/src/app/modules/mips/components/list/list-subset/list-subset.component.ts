import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ISubsetDataElement } from '../../../types/subset';

@Component({
  selector: 'app-list-subset',
  templateUrl: './list-subset.component.html',
  styleUrls: ['./list-subset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ListSubsetComponent implements OnInit, OnChanges {
  @Input() dataSourceSubsetRows: ISubsetDataElement[];
  columnsToDisplaySubset = ['subset'];
  expandedElementSubset: ISubsetDataElement | null;
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  @Input() subproposalsGroup: any;
  @Input() darkMode=false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.dataSourceSubsetRows?.length === 1) {
      setTimeout(() => {
        this.dataSourceSubsetRows[0].expanded = true;
        this.cdr.detectChanges();
      }, 500);
    }
  }

  // usefull for stop event click propagation when button for get subproposals is disabled and clicked
  onClickButtonCaptureEvent(e: Event) {
    e.stopPropagation();
  }

  onMouseOverLeaveSubsetArrow(subset: any, value: boolean) {
    this.isArrowDownOnMouseOver = value;
    this.currentRowOver = subset;
  }
}
