import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
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
  dataSourceMipsetRows: IMIPsetDataElement[] = [];
  columnsToDisplayMipset = ['mipset'];
  expandedElementMipset: IMIPsetDataElement | null;
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  // @Input() subproposalsGroup: any;
  mips: any = [];
  limit = 10;
  limitAux = 10;
  page = 0;
  order: string = 'mip';
  @Input() search: string = '';
  @Input() filter: any;
  loading: boolean = false;
  total: number;
  columnsToDisplay = ['pos', 'title', 'summary', 'status', 'link'];

  constructor(
    private smartSearchService: SmartSearchService,
    private mipsService: MipsService
  ) {}

  ngOnInit(): void {
    let index = this.filter.equals.findIndex(
      (item) => item.field === 'proposal'
    );
    this.filter.equals.splice(index, 1); // include subproposals in searching
    this.loading = true;
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
            })
            .sort((a: any, b: any) => (a.mipset < b.mipset ? -1 : 1));

          return modifiedTags;
        })
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          console.log('tags', data);
          this.dataSourceMipsetRows = data;
        },
        (error) => {
          this.loading = false;
        }
      );
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
    if (this.expandedElementMipset === row) {
      this.expandedElementMipset = null;
    } else {
      this.loading = true;
      this.filter.contains.push({ field: 'tags', value: row.mipset });
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
            this.expandedElementMipset = row;
            this.deleteFilterInarray(this.filter.contains, {
              field: 'tags',
              value: row.mipset,
            });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  deleteFilterInarray(array: Array<any>, data: any) {
    let index = array.findIndex(
      (i) => i.field === data.field && i.value === data.value
    );

    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  onScroll() {
    console.log('scrolling...');
  }
}
