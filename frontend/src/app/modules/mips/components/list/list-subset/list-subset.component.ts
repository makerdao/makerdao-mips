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

@Component({
  selector: 'app-list-subset',
  templateUrl: './list-subset.component.html',
  styleUrls: ['./list-subset.component.scss'],
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
export class ListSubsetComponent implements OnInit {
  @Input() dataSourceSubsetRows: any;
  columnsToDisplaySubset = ['subset'];
  expandedElementSubset: ISubsetDataElement | null;
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  @Input() subproposalsGroup: any;

  constructor() {}

  ngOnInit(): void {
    console.log("subproposalsGroup subset", this.subproposalsGroup);

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

export interface ISubsetDataElement {
  subset: string;
}
