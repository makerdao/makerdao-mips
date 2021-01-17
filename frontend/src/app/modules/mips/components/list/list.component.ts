import {ChangeDetectionStrategy, Component, Input, Output, ViewChild, EventEmitter} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';


const sampleData: DataElement[] = [
  {
    position: 1,
    title: 'TItle 1',
    summary: 'This is my summary number 1',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '1.github.com',
    forum: 'forum.com/1'
  },
  {
    position: 2,
    title: 'TItle 2',
    summary: 'This is my summary number 2',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '2.github.com',
    forum: 'forum.com/2'
  },
  {
    position: 3,
    title: 'TItle 3',
    summary: 'This is my summary number 3',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '3.github.com',
    forum: 'forum.com/3'
  },
  {
    position: 4,
    title: 'TItle 4',
    summary: 'This is my summary number 4',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'ACCEPTED',
    github: '4.github.com',
    forum: 'forum.com/4'
  },
  {
    position: 5,
    title: 'TItle 5',
    summary: 'This is my summary number 5',
    paragraph: 'TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood. TExt description under the hood.',
    status: 'REJECTED',
    github: '5.github.com',
    forum: 'forum.com/5'
  },
];

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListComponent {

  columnsToDisplay = ['pos', 'title', 'summary', 'status', 'link'];
  @Input() dataSource: any;
  @Input() loading = true;
  @Input() paginationTotal;
  expandedElement: DataElement | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selected = '-1';
  @Input() paginatorLength;
  pageEvent: PageEvent;
  @Output() send = new EventEmitter<number>();
  @Output() sendOrder = new EventEmitter<string>();
  timeout: any = null;

  getStatusValue(data: string): string {
    if (data !== undefined) {
      if (data.toLocaleLowerCase().includes('accepted')) {
          return 'ACCEPTED';
      }
      if (data.toLocaleLowerCase().includes('rfc')) {
        return 'RFC';
      }
      if (data.toLocaleLowerCase().includes('rejected')) {
        return 'REJECTED';
      }
      if (data.toLocaleLowerCase().includes('archived')) {
        return 'ARCHIVED';
      }
    }

    // return data;
  }

  updateSelected(index: string): void {
    if (this.selected === index) {
      this.selected = '-1';
    } else {
      this.selected = index;
    }
  }

  handlePageEvent(event: PageEvent): void {
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = setTimeout(() => {
        $this.send.emit(event.pageIndex);
    }, 1000);
  }

  onSendOrderASC(value: string): void {
    this.sendOrder.emit(this.transforValue(value));
  }
  onSendOrderDES(value: string): void {
    this.sendOrder.emit('-' + this.transforValue(value));
  }

  transforValue(value: string): string {
    if (value === 'pos') { return 'mip'; }
    if (value === 'title') { return 'title'; }
    if (value === 'summary') { return 'sentenceSummary'; }
    if (value === 'status') { return 'status'; }
  }

}

export interface DataElement {
  position: number;
  title: string;
  summary: string;
  paragraph: string;
  status: string;
  github: string;
  forum: string;
}

