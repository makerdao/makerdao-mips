import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  active: any;
  @Input() darkMode:boolean = false;
  @Output() selectMipFromMenu = new EventEmitter<string>();
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private langService: LangService,
    private cdr: ChangeDetectorRef
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
      this.selectMipFromMenu.emit(escapedText);
    return `${url}#${escapedText}`;
  }

  idBySection(text: string): string {
    const pattern = /\bmip[0-9]+c[0-9]+:/i;
    if (pattern.test(text)) {
      return this.prefixIdLinkSection + text.split(':')[0];
    }

    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return this.prefixIdLinkSection + escapedText;
  }

  setActiveLinkSection(str: string) {
    this.findSectionLink(str);
  }

  findSectionLink(str: string) {
    let elem = document.querySelector('#' + this.prefixIdLinkSection + str);

    if (elem) {
      this.active = elem.id;
    }

    this.cdr.detectChanges();
  }

  scroll(url: string) {
    location.href = url;
  }
}
