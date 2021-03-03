import { Component } from '@angular/core';
import { FooterVisibleService } from './services/footer-visible/footer-visible.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(private footerVisibleService: FooterVisibleService) {}

  onFooterVisible(event) {
    this.footerVisibleService.setFooterVisibility(event);
  }
}
