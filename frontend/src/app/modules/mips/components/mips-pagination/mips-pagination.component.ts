import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { MipsService } from '../../services/mips.service';

@Component({
  selector: 'app-mips-pagination',
  templateUrl: './mips-pagination.component.html',
  styleUrls: ['./mips-pagination.component.scss'],
})
export class MipsPaginationComponent implements OnInit, OnChanges {
  @Input() mipPosition = 1;
  @Input() total: number;
  @Output() send = new EventEmitter<number>();
  timeout: any = null;
  @Input() mipName: string;
  @Input() parent: string;
  breadcrumbList: BreadcrumbItem[] = [];

  constructor(private mipsService: MipsService, private router: Router) {}

  ngOnInit(): void {
    this.mipPosition = this.mipPosition !== undefined ? this.mipPosition : 0;
  }

  ngOnChanges() {
    this.breadcrumbList = [];
    if (this.parent) {
      this.breadcrumbList.push({ id: this.parent, name: this.parent });
    }

    this.breadcrumbList.push({ id: this.mipName, name: this.mipName });
  }

  loadMipsData(): void {
    if (this.mipPosition < this.total - 1) {
      // this.mipsService.updateActiveSearch(true);
      this.mipPosition++;
      this.send.emit(this.mipPosition);
    }
  }

  minus(): void {
    if (this.mipPosition > 0) {
      this.mipPosition--;
      this.send.emit(this.mipPosition);
    }
  }

  clearFilterAndGoHome(): void {
    this.mipsService.clearFilter();
    this.router.navigateByUrl('/mips/list');
  }

  isLastItem(index: number): boolean {
    return index + 1 === this.breadcrumbList.length;
  }
}

interface BreadcrumbItem {
  id: string;
  name: string;
}
