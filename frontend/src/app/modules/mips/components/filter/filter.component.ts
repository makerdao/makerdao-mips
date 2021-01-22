import { Component, OnInit, Output, ViewChild, EventEmitter, Input, HostListener, ElementRef } from '@angular/core';
import { MipsService } from '../../services/mips.service';
import FilterData from './filter.data';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  statusCLass: 'status-accepted' | 'status-rejected' | 'status-archive' | 'status-rfc' | 'status-none';
  typeCLass: 'type-selected' | 'type-none';
  statusInputText  = 'Select status';
  statusOptionsShow = false;
  typeInputText  = 'Select type';
  typeOptionsShow = false;
  @Input() contentOptionsShow = false;
  titleText = '';
  @ViewChild('title') inputTitle;
  @Output() send = new EventEmitter();
  filterData: FilterData;
  filterDataSaved: FilterData;
  posStatus: number;
  posType: number;
  inside = false;

  @HostListener('document:click', ['$event'])
  clickout(event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (this.inside && this.contentOptionsShow) {
        this.inside = false;
      } else {
        this.contentOptionsShow = false;
      }
    }
  }

  constructor(
    private mipsService: MipsService,
    private eRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.statusCLass = 'status-none';
    this.typeCLass = 'type-none';
  }

  showFilter(): void {
    this.contentOptionsShow = !this.contentOptionsShow;
    if (this.contentOptionsShow) {
      this.inside = true;
      this.filterDataSaved = this.mipsService.getFilter();
      this.titleText = this.filterDataSaved.title;
      this.setStatusClassAndText(this.filterDataSaved.posStatus);
      this.setTyepClassAndText(this.filterDataSaved.posType);
    }
  }

  setStatusClassAndText(pos: number): void {
    this.posStatus = pos;
    this.inside = true;
    switch (pos) {
      case 0: { this.statusCLass = 'status-accepted'; this.statusInputText = 'ACCEPTED'; this.statusOptionsShow = false; break; }
      case 1: { this.statusCLass = 'status-rejected'; this.statusInputText = 'REJECTED'; this.statusOptionsShow = false; break; }
      case 2: { this.statusCLass = 'status-archive'; this.statusInputText = 'ARCHIVE'; this.statusOptionsShow = false; break; }
      case 3: { this.statusCLass = 'status-rfc'; this.statusInputText = 'RFC'; this.statusOptionsShow = false; break; }
      case 4: { this.statusCLass = 'status-none'; this.statusInputText = 'Select status'; this.statusOptionsShow = false; break; }
    }
  }

  setTyepClassAndText(pos: number): void {
    this.posType = pos;
    this.inside = true;
    switch (pos) {
      case 0: { this.typeCLass = 'type-selected'; this.typeInputText = 'PROPOSAL'; this.typeOptionsShow = false; break; }
      case 1: { this.typeCLass = 'type-selected'; this.typeInputText = 'SUB-PROPOSAL'; this.typeOptionsShow = false; break; }
      case 2: { this.typeCLass = 'type-none'; this.typeInputText = 'Select Type'; this.typeOptionsShow = false; break; }
    }
  }

  containerShowStatus(): void {
    this.contentOptionsShow = !this.contentOptionsShow;
  }

  reset(): void {
    this.setStatusClassAndText(4);
    this.setTyepClassAndText(2);
    this.inputTitle.nativeElement.value = '';
    this.typeInputText = 'NONE';
    this.statusInputText = 'Select status';
    this.posStatus = 4;
    this.posType = 2;
    this.apply();
  }

  apply(): void {
    this.filterData = {
      title: this.inputTitle.nativeElement.value,
      status: this.statusInputText,
      type: this.typeInputText,
      posStatus: this.posStatus,
      posType: this.posType
    };
    this.mipsService.setFilter(this.filterData);
    this.contentOptionsShow = false;
    this.send.emit();
  }

}
