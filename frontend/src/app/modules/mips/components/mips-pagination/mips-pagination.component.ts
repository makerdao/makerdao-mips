import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MipsService } from '../../services/mips.service';


@Component({
  selector: 'app-mips-pagination',
  templateUrl: './mips-pagination.component.html',
  styleUrls: ['./mips-pagination.component.scss']
})
export class MipsPaginationComponent implements OnInit {

  @Input() mipNumber: string;
  @Input() mipPosition = 1;
  @Input() total: number;
  @Output() send = new EventEmitter<number>();
  timeout: any = null;

  constructor(
    private mipsService: MipsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mipPosition = this.mipPosition !== undefined ? this.mipPosition : 0;
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

}
