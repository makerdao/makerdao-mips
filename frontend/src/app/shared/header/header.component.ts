import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MipsService } from '../../modules/mips/services/mips.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  menuOpen: boolean;
  @ViewChild('navMenu') navMenu: ElementRef;
  transitionTime: number;
  transitionStyle: string;
  positionX: number = 0;

  constructor(
    private router: Router,
    private mipsService: MipsService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.transitionTime = this.menuService.transitionTime;
    this.transitionStyle = 'transform ' + this.transitionTime + 's ease-in-out';
  }

  ngAfterViewInit() {
    this.menuService.posXClicked$.subscribe((data) => {
      (this.navMenu.nativeElement as HTMLElement).scrollLeft += data;
    });
  }

  clearFilterAndGoHome(): void {
    this.mipsService.clearFilter();
    this.onRefresh();
  }

  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){return false;};

    let currentUrl = this.router.url + '?';

    this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate(['/mips/list']);
      });
    }

  onMenuToggle(ev) {
    if (!ev) {
      this.menuService.setOpenedIndexChild(-1);
    }

    this.menuOpen = ev;
  }
}
