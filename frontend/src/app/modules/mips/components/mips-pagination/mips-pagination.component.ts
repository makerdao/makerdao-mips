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
  // @Input() mipId: string;
  breadcrumbList: BreadcrumbItem[] = [];
  currentMipName: string;

  constructor(
    private mipsService: MipsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mipPosition = this.mipPosition !== undefined ? this.mipPosition : 0;
  }

  ngOnChanges() {
    if (this.mipName !== this.currentMipName) {
      this.currentMipName = this.mipName;

      if (this.breadcrumbList.length === 0 && this.parent) {
        this.initBreadcrumbFromSubproposal();
      } else {
        if (this.parent && this.findParentBreadcrumbItem() === -1) {
          this.initBreadcrumbFromSubproposal();
        } else {
          this.updateBreadcrumb();
        }
      }
    }
  }

  updateBreadcrumb() {
    let item: BreadcrumbItem = { id: this.mipName, name: this.mipName };
    let indexParentItem = this.findParentBreadcrumbItem();

    if (indexParentItem === -1) {
      this.breadcrumbList.splice(0, this.breadcrumbList.length);
    } else {
      this.breadcrumbList.splice(indexParentItem + 1, this.breadcrumbList.length);
    }

    this.breadcrumbList.push({ ...item });
  }

  async initBreadcrumbFromSubproposal() {
    this.breadcrumbList = [];
    this.breadcrumbList.push({id: this.mipName, name: this.mipName});
    let parent: any;
    let parentName = this.parent;

    while (parentName) {
      let filter = {
        equals: [],
      };

      filter.equals.push({field: 'mipName', value: parentName});
      let mips = await this.searchMipsByName(0, 0, 'mipName', '', filter);

      if (mips.items && mips.items.length > 0) {
        parent = mips.items[0];
        parentName = mips.items[0].proposal;

        if (this.breadcrumbList.findIndex(i => i.name === mips.items[0].mipName) === -1) {
          this.breadcrumbList.push({id: parent.mipName, name: parent.mipName});
        }
      }
    }

    this.breadcrumbList.reverse();

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

  searchMipsByName(limit, page, order, search, filter): Promise<any> {
    return this.mipsService.searchMips(limit, page, order, search, filter).toPromise<any>();
  }

}

interface BreadcrumbItem {
  id: string;
  name: string;
}
