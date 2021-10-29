import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FooterVisibleService } from './services/footer-visible/footer-visible.service';
import { ElementsRefUiService } from './services/elements-ref-ui/elements-ref-ui.service';
import { DarkModeService } from './services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'frontend';
  @ViewChild('container') container: ElementRef;

  constructor(
    private footerVisibleService: FooterVisibleService,
    private elementsRefUiService: ElementsRefUiService,
    public darkModeService:DarkModeService,
  ) {}

  onFooterVisible(event) {
    this.footerVisibleService.setFooterVisibility(event);
  }

  ngAfterViewInit() {
    this.elementsRefUiService.containerRef = this.container;
  }
}
