import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FooterVisibleService } from './services/footer-visible/footer-visible.service';
import { ElementsRefUiService } from './services/elements-ref-ui/elements-ref-ui.service';
import { MetadataShareService } from './modules/mips/services/metadata-share.service';

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
    private metadataShareService: MetadataShareService
  ) {}

  onFooterVisible(event) {
    this.footerVisibleService.setFooterVisibility(event);
  }

  ngAfterViewInit() {
    this.elementsRefUiService.containerRef = this.container;
    this.metadataShareService.image = window.location.origin + '/assets/images/logo_desktop2.png';
    this.setMetadataShareable();
  }

  setMetadataShareable() {
    this.metadataShareService.title$.subscribe((data) => {
      const mtog = document.head.querySelector('#titleOG');
      mtog.setAttribute('content', data);
      const mtTwitter = document.head.querySelector('#titleTwitter');
      mtTwitter.setAttribute('content', data);
    });

    this.metadataShareService.description$.subscribe((data) => {
      const mdog = document.head.querySelector('#descriptionOG');
      mdog.setAttribute('content', data);
      const mdTwitter = document.head.querySelector('#descriptionTwitter');
      mdTwitter.setAttribute('content', data);
    });

    this.metadataShareService.image$.subscribe((data) => {
      const miog = document.head.querySelector('#imageOG');
      miog.setAttribute('content', data);
      const miTwitter = document.querySelector('#imageTwitter');
      miTwitter.setAttribute('content', data);
    });
  }
}
