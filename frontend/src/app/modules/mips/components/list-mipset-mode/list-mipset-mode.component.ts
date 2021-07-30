import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { MipsService } from '../../services/mips.service';
import { SmartSearchService } from '../../services/smart-search.service';
import { IMIPsetDataElement } from '../../types/mipset';

@Component({
  selector: 'app-list-mipset-mode',
  templateUrl: './list-mipset-mode.component.html',
  styleUrls: ['./list-mipset-mode.component.scss'],
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
export class ListMipsetModeComponent implements OnInit {
  dataSourceMipsetRows: IMIPsetDataElement[];
  columnsToDisplayMipset = ['mipset'];
  expandedElementMipset: IMIPsetDataElement | null;
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  // @Input() subproposalsGroup: any;
  mips: any = [];
  limit = 10;
  limitAux = 10;
  page = 0;
  order: string;
  search: string = '';
  filter: any;
  loading: boolean = false;
  total: number;

  constructor(
    private smartSearchService: SmartSearchService,
    private mipsService: MipsService
  ) {}

  ngOnInit(): void {
    this.smartSearchService
      .getOptions('tags', '')
      .pipe(
        map((tags: any[]) => {
          let modifiedTags: any[] = tags
            .filter((item: any) => (item.tag as string).endsWith('-mipset'))
            .map((i) => {
              return {
                mipset: i.tag,
              };
            });

          return modifiedTags;
        })
      )
      .subscribe((data: any) => {
        console.log('tags', data);
        this.dataSourceMipsetRows = data;
      });
  }

  // usefull for stop event click propagation when button for get subproposals is disabled and clicked
  onClickButtonCaptureEvent(e: Event) {
    e.stopPropagation();
  }

  onMouseOverLeaveMipsetArrow(mipset: any, value: boolean) {
    this.isArrowDownOnMouseOver = value;
    this.currentRowOver = mipset;
  }

  onExpandMipset(row) {
    this.search = '$#' + row.mipset;
    this.mipsService
      .searchMips(
        this.limit,
        this.page,
        this.order,
        this.search,
        this.filter,
        'title proposal filename mipName paragraphSummary sentenceSummary mip status mipFather'
      )
      .subscribe(
        (data) => {
          console.log('data', data);
          this.mips = data.items;
          console.log('mips', this.mips);

          this.loading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
