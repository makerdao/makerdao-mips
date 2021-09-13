import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
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
  showScrollRightButton = false;

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

    this.initIntersectionObserver();
  }

  initIntersectionObserver() {
    let options = {
      root: this.navMenu.nativeElement,
      rootMargin: '0px',
      threshold: 1.0,
    };

    let observer = new IntersectionObserver(this.callback, options);
    let target1 = document.querySelector('#lastChild');
    observer.observe(target1);
    let target2 = document.querySelector('#firstChild');
    observer.observe(target2);
  }

  callback = (entries, observer) => {
    entries.forEach((entry) => {
      // if (entry.intersecting) {
      //   this.lastChildVisible.next(true);
      // } else {
      //   this.lastChildVisible.next(false);
      // }

      // this.lastChildVisible.next(entry.isIntersecting);
      this.showScrollRightButton = entry.isIntersecting;
      // Cada entry describe un cambio en la intersección para
      // un elemento observado
      //   entry.boundingClientRect
      //   entry.intersectionRatio
      //   entry.intersectionRect
      //   entry.isIntersecting
      //   entry.rootBounds
      //   entry.target
      //   entry.time
    });
  };

  clearFilterAndGoHome(): void {
    this.mipsService.clearFilter();
    this.onRefresh();
  }

  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function (
      future: ActivatedRouteSnapshot,
      curr: ActivatedRouteSnapshot
    ) {
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

  onMenuToggle(ev) {
    if (!ev) {
      this.menuService.setOpenedIndexChild(-1);
    }

    this.menuOpen = ev;
  }

  scrollNavMenu(steps: number) {
    (this.navMenu.nativeElement as HTMLElement).scrollBy(steps, 0);
  }

  visibilityScrollRightButton(value: boolean) {
    this.showScrollRightButton = value;
  }
}
