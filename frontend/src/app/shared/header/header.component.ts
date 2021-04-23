import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MipsService } from '../../modules/mips/services/mips.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen: boolean;

  constructor(
    private router: Router,
    private mipsService: MipsService
  ) { }

  ngOnInit(): void {
  }

  clearFilterAndGoHome(): void {
    this.mipsService.clearFilter();
    this.router.navigateByUrl('/mips/list');
  }

  onMenuToggle(ev) {
    this.menuOpen = ev;
  }

}
