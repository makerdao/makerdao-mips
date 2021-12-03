import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import { MipsService } from '../../modules/mips/services/mips.service';
import { MenuService } from '../../services/menu/menu.service';

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
  positionX = 0;
  showScrollRightButton = false;
  showScrollLeftButton = false;
  @ViewChild('outerRight') outerRight: ElementRef;
  @ViewChild('outerLeft') outerLeft: ElementRef;

  constructor(
    private router: Router,
    private mipsService: MipsService,
    private menuService: MenuService,
    public darkModeService: DarkModeService,
  ) {}

  ngOnInit(): void {
    this.transitionTime = this.menuService.transitionTime;
    this.transitionStyle = 'transform ' + this.transitionTime + 's ease-in-out';
  }

  ngAfterViewInit(): void {
    this.menuService.posXClicked$.subscribe((data) => {
      if (window.innerWidth <= 768) {
        (this.navMenu.nativeElement as HTMLElement).scrollLeft += data;
      }
    });

    this.initIntersectionObserver();
  }

  initIntersectionObserver(): void {
    const options = {
      root: this.navMenu.nativeElement,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(this.callback, options);
    const target1 = document.querySelector('#outerRight');
    observer.observe(target1);
    const target2 = document.querySelector('#outerLeft');
    observer.observe(target2);
  }

  callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.target === this.outerRight.nativeElement) {
        this.showScrollRightButton = !entry.isIntersecting;
      }

      if (entry.target === this.outerLeft.nativeElement) {
        this.showScrollLeftButton = !entry.isIntersecting;
      }
    });
  }

  clearFilterAndGoHome(): void {
    this.mipsService.clearFilter();
    this.onRefresh();
  }

  onRefresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = (
      future: ActivatedRouteSnapshot,
      curr: ActivatedRouteSnapshot
    ) => {
      if (
        future.url.toString() === 'list' &&
        curr.url.toString() === future.url.toString()
      ) {
        return false;
      }
      return future.routeConfig === curr.routeConfig;
    };

    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/mips/list']).then((_) => {
      this.router.onSameUrlNavigation = 'ignore';
    });
  }

  onMenuToggle(ev): void {
    if (!ev) {
      this.menuService.setOpenedIndexChild(-1);
    }

    this.menuOpen = ev;
  }

  scrollNavMenuToLeft(): void {
    const x = (this.navMenu.nativeElement as HTMLElement).clientWidth;

    (this.navMenu.nativeElement as HTMLElement).scrollBy(-x, 0);
  }

  scrollNavMenuToRight(): void {
    const x = (this.navMenu.nativeElement as HTMLElement).clientWidth;

    (this.navMenu.nativeElement as HTMLElement).scrollBy( x, 0);


  }

  visibilityScrollRightButton(value: boolean): void {
    this.showScrollRightButton = value;
  }
}
