import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import FilterData from './filter.data';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  statusCLass: 'status-accepted' | 'status-rejected' | 'status-archive' | 'status-rfc' | 'status-none';
  statusInputText  = 'Select status';
  statusOptionsShow = false;
  typeInputText  = 'Select status';
  typeOptionsShow = false;
  contentOptionsShow = false;
  titleText: string;
  @ViewChild('title') inputTitle;
  @Output() send = new EventEmitter<FilterData>();
  filterData: FilterData;

  constructor() { }

  ngOnInit(): void {
    this.statusCLass = 'status-none';
  }

  setStatusClassAndText(pos: number): void {
    switch (pos) {
      case 0: { this.statusCLass = 'status-accepted'; this.statusInputText = 'ACCEPTED'; this.statusOptionsShow = false; break; }
      case 1: { this.statusCLass = 'status-rejected'; this.statusInputText = 'REJECTED'; this.statusOptionsShow = false; break; }
      case 2: { this.statusCLass = 'status-archive'; this.statusInputText = 'ARCHIVE'; this.statusOptionsShow = false; break; }
      case 3: { this.statusCLass = 'status-rfc'; this.statusInputText = 'RFC'; this.statusOptionsShow = false; break; }
      case 4: { this.statusCLass = 'status-none'; this.statusInputText = 'Select status'; this.statusOptionsShow = false; break; }
    }
  }

  setTyepClassAndText(pos: number): void {
    switch (pos) {
      case 0: { this.typeInputText = 'PROPOSAL'; this.typeOptionsShow = false; break; }
      case 1: { this.typeInputText = 'SUB-PROPOSAL'; this.typeOptionsShow = false; break; }
      case 2: { this.typeInputText = 'Select Type'; this.typeOptionsShow = false; break; }
    }
  }

  containerShowStatus(): void {
    this.contentOptionsShow = !this.contentOptionsShow;
  }

  reset(): void {
    this.setStatusClassAndText(4);
    this.setTyepClassAndText(2);
    this.inputTitle.nativeElement.value = ' ';
  }

  apply(): void {
    this.filterData.title = this.inputTitle.nativeElement.value;
    this.filterData.status = this.statusInputText;
    this.filterData.type = this.typeInputText;
    this.send.emit(this.filterData);
  }

}
