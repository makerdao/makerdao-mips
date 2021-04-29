import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    // console.log('transition', this.transitionStyle);

  }

  ngAfterViewInit() {
    this.menuService.posXClicked$.subscribe((data) => {
      console.log('posXClicked$', data);
      // console.log('navMenu', this.navMenu.nativeElement);

      this.positionX += data;
      // ((this.navMenu.nativeElement as HTMLElement)
      //   .firstElementChild as HTMLElement).style.transform =
      //   'translateX(' + -this.positionX + 'px)';

        (this.navMenu.nativeElement as HTMLElement).scrollLeft += data;
    });
  }

  clearFilterAndGoHome(): void {
    this.mipsService.clearFilter();
    this.router.navigateByUrl('/mips/list');
  }

  onMenuToggle(ev) {
    if (!ev) {
      this.menuService.setOpenedIndexChild(-1);
    }

    this.menuOpen = ev;
  }

  onScroll() {
    console.log('onScroll');
  }
}
