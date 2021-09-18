import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'src/app/services/lang/lang.service';

@Component({
  selector: 'app-proposal-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proposal-components.component.html',
  styleUrls: ['./proposal-components.component.scss'],
})
export class ProposalComponentsComponent implements AfterViewInit {
  @Input() sourceData;
  @Input() titleSidebar = 'Contents';
  @Input() showlevelOne: boolean = false;
  prefixIdLinkSection: string = 'sectionLink-';
  @ViewChild('sectionLinks') sectionLinks;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private translate: TranslateService,
    private langService: LangService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.langService.currentLang$.subscribe((language: string) => {
      this.translate.use(language);
    });
  }
  
  ngAfterViewInit() {
    this.route.fragment.subscribe((data) => {
      this.setActiveLinkSection(data);
    });
  }

  getLinkBySection(section): string {
    let url = this.router.url.split('#')[0];

    const escapedText = section.mipComponent
      ? section.mipComponent
      : section.heading.toLowerCase().replace(/[^\w]+/g, '-');

    return `${url}#${escapedText}`;
  }

  idBySection(text: string): string {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return this.prefixIdLinkSection + escapedText;
  }

  setActiveLinkSection(str: string) {
    this.findSectionLink(str);
  }

  findSectionLink(str: string) {
    let elem = document.querySelector('#' + this.prefixIdLinkSection + str);

    if (elem) {
      elem.classList.toggle('active');
    }

    let sectionLinks = (this.sectionLinks
      .nativeElement as HTMLElement).getElementsByTagName('a');

    for (let index = 0; index < sectionLinks.length; index++) {
      if (sectionLinks.item(index) !== elem) {
        sectionLinks.item(index).classList.remove('active');
      }
    }
  }
}
