import { Component, OnInit, Output, ViewChild, EventEmitter, Input, HostListener, ElementRef } from '@angular/core';
import { MipsService } from '../../services/mips.service';
import FilterData from './filter.data';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  statusCLass: string;
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
  selecteds: number[];
  cantSelected = 0;

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
    console.log('inicio');
  }

  // ----------- Funtion to load the filters
  showFilter(): void {
    this.contentOptionsShow = !this.contentOptionsShow;
    if (this.contentOptionsShow) {
      this.inside = true;
      this.filterDataSaved = this.mipsService.getFilter();
      this.titleText = this.filterDataSaved.title;
      // this.setTyepClassAndText(this.filterDataSaved.posType);
      this.selecteds = this.filterDataSaved.arrayStatus;
      console.log('valores ' + this.selecteds);
      this.cantSelected = this.selecteds.filter(a => a === 1).length;
      if (this.cantSelected === 1) {
        this.setStatusClassAndText(this.filterDataSaved.arrayStatus.findIndex(a => a === 1), true);
      } else {
        this.statusInputText = this.getText();
      }
    }
  }

  setStatusClassAndText(pos: number, add = false): void {
    this.posStatus = pos;
    this.inside = true;
    this.statusOptionsShow = false;
    switch (pos) {
      case 0: {
                if (this.selecteds[0] === 0)  {
                  this.selecteds[0] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[0] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 1: {
                if (this.selecteds[1] === 0)  {
                  this.selecteds[1] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[1] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 2: {
                if (this.selecteds[2] === 0)  {
                  this.selecteds[2] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[2] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 3: {
                if (this.selecteds[3] === 0)  {
                  this.selecteds[3] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[3] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 4: {
                this.statusCLass = 'status-none';
                this.statusInputText = 'Select status';
                this.statusOptionsShow = false;
                this.selecteds = [0 , 0, 0, 0];
                this.cantSelected = 0;
                break;
              }
      }
    this.statusCLass = this.cantSelected === 1 ? this.getClass() : 'status-none';
    this.statusInputText = this.getText();
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
    this.selecteds = [0, 0, 0, 0];
    this.apply();
  }

  apply(): void {
    this.filterData = {
      title: this.inputTitle.nativeElement.value,
      status: this.statusInputText,
      type: this.typeInputText,
      posStatus: this.posStatus,
      posType: this.posType,
      arrayStatus: this.selecteds
    };
    this.mipsService.setFilter(this.filterData);
    this.contentOptionsShow = false;
    this.send.emit();
  }

  getClass(): string {
    if (this.selecteds[0] === 1 ) { return 'status-accepted'; }
    if (this.selecteds[1] === 1 ) { return 'status-rejected'; }
    if (this.selecteds[2] === 1 ) { return 'status-archive'; }
    if (this.selecteds[3] === 1 ) { return 'status-rfc'; }
  }

  getText(): string {
    if (this.cantSelected === 1) {
      if (this.selecteds[0] === 1 ) { return 'ACCEPTED'; }
      if (this.selecteds[1] === 1 ) { return 'REJECTED'; }
      if (this.selecteds[2] === 1 ) { return 'ARCHIVE'; }
      if (this.selecteds[3] === 1 ) { return 'RFC'; }
    }
    if (this.cantSelected === 0) { return 'Select status'; }
    return '';
  }

}
