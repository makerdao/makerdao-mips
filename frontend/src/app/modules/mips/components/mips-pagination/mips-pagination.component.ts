import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MipsService } from '../../services/mips.service';


@Component({
  selector: 'app-mips-pagination',
  templateUrl: './mips-pagination.component.html',
  styleUrls: ['./mips-pagination.component.scss']
})
export class MipsPaginationComponent implements OnInit, OnChanges {

  @Input() mipNumber: string;
  @Input() mipPosition = 1;
  @Input() total: number;
  @Output() send = new EventEmitter<number>();
  timeout: any = null;
  @Input() mipName: string;
  @Input() parent: string;
  @Input() mipId: string;
  breadcrumbList: BreadcrumbItem[] = [];

  constructor(
    private mipsService: MipsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mipPosition = this.mipPosition !== undefined ? this.mipPosition : 0;
  }

  ngOnChanges() {
    this.updateBreadcrumb();
  }

  updateBreadcrumb() {
    let item: BreadcrumbItem = { id: this.mipId, name: this.mipName };
    let indexParentItem = this.findParentBreadcrumbItem();

    if (indexParentItem === -1) {
      this.breadcrumbList.splice(0, this.breadcrumbList.length);
    } else {
      this.breadcrumbList.splice(indexParentItem + 1, this.breadcrumbList.length);
    }

    this.breadcrumbList.push({ ...item });
  }

  findParentBreadcrumbItem(): number {
    return this.breadcrumbList.findIndex(item => item.name === this.parent);
  }

  loadMipsData(): void {
    if (this.mipPosition < this.total - 1) {
      this.mipsService.updateActiveSearch(true);
      this.mipPosition++;
      clearTimeout(this.timeout);
      const $this = this;
      this.timeout = setTimeout(() => {
          $this.send.emit(this.mipPosition);
      }, 1000);
    }
  }

  minus(): void {
    if (this.mipPosition > 0) {
      this.mipPosition--;
      clearTimeout(this.timeout);
      const $this = this;
      this.timeout = setTimeout(() => {
          $this.send.emit(this.mipPosition);
      }, 1000);
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
