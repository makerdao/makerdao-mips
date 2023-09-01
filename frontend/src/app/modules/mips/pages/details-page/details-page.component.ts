import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MipsService } from '../../services/mips.service';
import { UrlService } from 'src/app/services/url/url.service';
import { LangService } from 'src/app/services/lang/lang.service';
import { Language } from 'src/app/data-types/languages';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import { DetailContentComponent } from '../../components/detail-content/detail-content.component';
const YAML = require('yaml');
@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
})
export class DetailsPageComponent implements OnInit {
  mip: any;
  mdUrl: any;
  sections: any;
  pullrequest: any;
  mipName: string;
  mipPosition: number;
  total: number;
  MAX_LIMIT: number = 1000000;
  subproposals: any[];
  referencesContent: string[];
  loadingUrl: boolean = true;
  references = [];
  languagesAvailables: any[];
  documentLanguage: Language;
  TABS_OPTIONS = ['Languages', 'Details', 'Recent Changes', 'References'];
  selectedTab:
    | 'Languages'
    | 'Details'
    | 'Recent Changes'
    | 'References'
    | null = null;

  @ViewChild('detail') detail: DetailContentComponent;
  constructor(
    private mipsService: MipsService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    public darkModeService: DarkModeService,
    private langService: LangService,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    this.loadingUrl = true;
    this.documentLanguage = this.langService.lang as Language;

    this.activedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('name')) {
        this.documentLanguage = this.langService.lang as Language;
        this.mipName = paramMap.get('name');
        this.total = this.mipsService.getTotal();
        this.loadData();
        this.moveToElement();
      }
    });

    this.activedRoute.queryParamMap.subscribe((queryParam) => {
      if (queryParam.has('mdUrl') && !queryParam.has('fromChild')) {
        const rawUrl = queryParam.get('mdUrl');
        let url = '';

        try {
          url = new URL(rawUrl).href;
        } catch {
          console.log('ERROR: Could not parse a valid URL');
        }

        const shouldUpdateUrl = this.urlService.getMdFromGithubUrl(url);
        const isUrlFromValidOrganization =
          url.startsWith('https://github.com/makerdao/mips/blob/master') ||
          url.startsWith(
            'https://raw.githubusercontent.com/makerdao/mips/master'
          );

        if (shouldUpdateUrl) {
          this.router.navigateByUrl(this.urlService.transformLinkForMd(url));
        } else if (!isUrlFromValidOrganization) {
          this.router.navigate(['page-not-found']);
        } else this.mdUrl = url;
        this.moveToElement();
      }
    });
  }

  headingListUpdate(event) {
    this.loadingUrl = false;
    if (this.mdUrl) {
      this.sections = null;
      this.sections = event;

      if (this.detail) {
        this.detail.sections = this.sections;
        this.detail.doReloadSourceData();
      }
    }
  }

  translateKeywords(
    sectionsRaw: any[],
    metaVars: any[],
    sections: Boolean = false
  ) {
    const translationToUse = metaVars.find(
      (item) => item.language === this.documentLanguage
    );
    const keywords = translationToUse?.translations?.reserved;
    if (keywords) {
      if (sections) {
        // Translation of the keywords for heading for the lateral menu
        const updatedSections = sectionsRaw.map((item) => {
          let heading = item.heading;
          Object.keys(keywords).forEach((key) => {
            heading = heading.replace(key, keywords[key]);
          });
          return { ...item, heading };
        });

        return updatedSections;
      } else {
        // Translation of the keywords for heading for the main Document
        const updatedSectionsRaw = sectionsRaw.map((item) => {
          Object.keys(keywords).forEach((key) => {
            item = item.replace(key, keywords[key]);
          });
          return item;
        });

        return updatedSectionsRaw;
      }
    }
    return sectionsRaw;
  }

  loadData(): void {
    const lang: Language =
      this.documentLanguage ||
      (this.langService.lang as Language) ||
      Language.English;

    this.mipsService.getMipWithLanguage(this.mipName, lang).subscribe(
      (data) => {
        const metaVars = data.metaVars.map((item) => ({
          ...item,
          translations: YAML.parse(item.translations),
        }));

        this.mip = {
          ...data.mip,
        };

        this.references = data.mip?.references?.filter((item) => {
          return item.name !== '\n';
        });

        this.sections = this.mip.sections;

        let indexPreambleSection: number = (this.sections as []).findIndex(
          (i: any) => i.heading === 'Preamble'
        );

        if (indexPreambleSection !== -1) {
          (this.sections as []).splice(indexPreambleSection, 1);
        }

        let indexPreambleHeading: number = data.mip.sectionsRaw.findIndex(
          (i: any) => (i as string).includes('Preamble')
        );

        let sectionsRaw = [...(this.mip.sectionsRaw as [])];

        if (indexPreambleHeading !== -1) {
          sectionsRaw.splice(indexPreambleHeading, 2); // delete Preamble heading and its content
        }

        let indexReferencesSection: number = (this.sections as []).findIndex(
          (i: any) => i.heading === 'References'
        );

        if (indexReferencesSection !== -1) {
          (this.sections as []).splice(indexReferencesSection, 1);
        }

        let indexReferencesHeading: number = (sectionsRaw as [

        ]).findIndex((i: any) => (i as string).includes('References'));

        if (indexReferencesHeading !== -1) {
          (sectionsRaw as []).splice(indexReferencesHeading, 2);
        }

        this.mip = {
          ...this.mip,
          sectionsRaw: this.translateKeywords(sectionsRaw, metaVars),
        };

        this.sections = this.sections.map((item) => ({
          ...item,
          initialName: item.heading,
        }));
        this.sections = this.translateKeywords(
          [...this.sections],
          metaVars,
          true
        );

        if (Object.values(Language).includes(data.mip.language)) {
          this.documentLanguage = data.mip.language as Language;
        }
        this.languagesAvailables = data.languagesAvailables;

        this.pullrequest = data.pullRequests;
        this.subproposals = data.subproposals;

        if (!this.mipsService.getMipsData()) {
          this.getMips();
        } else if (this.mip.proposal && !this.mipsService.includeSubproposals) {
          this.mipsService.includeSubproposals = true;
          this.getMips();
        }

        this.loadingUrl = false;
      },
      (error) => {
        if (error.error && error.error.statusCode === 404) {
          this.router.navigate(['page-not-found'], {
            skipLocationChange: true,
          });
        }
      }
    );
    const data = this.mipsService.getMipsData();

    if (data) {
      this.mipPosition = data.findIndex(
        (item) => item.mipName === this.mipName
      );
    }
  }

  updateDocumentLanguage(newLang: Language) {
    this.mip = null;
    this.loadingUrl = true;
    this.documentLanguage = newLang;
    this.loadData();
  }

  mipsPagination(position: number): void {
    const data = this.mipsService.getMipsData();
    this.mipName = data[position].mipName;

    this.router.navigate(['/mips/details', this.mipName]);
  }

  moveToElement(): void {
    const el = document.getElementById('logo');
    el.scrollIntoView();
  }

  getMips(): void {
    let order = 'mip';
    let filter = {
      contains: [],
      notcontains: [],
      equals: [],
      notequals: [],
      inarray: [],
    };

    filter.notequals.push({ field: 'mip', value: -1 });

    order = 'mip subproposal';
    this.mipsService.includeSubproposals = true;

    this.searchMips(this.MAX_LIMIT, 0, order, '', filter);
  }

  searchMips(limit, page, order, search, filter): void {
    this.mipsService
      .searchMips(limit, page, order, search, filter, 'mipName')
      .subscribe((data) => {
        this.mipsService.setMipsData(data.items);
        this.total = data.total;
        this.mipsService.setTotal(this.total);
        const mips = this.mipsService.getMipsData();
        this.mipPosition = mips.findIndex(
          (item) => item.mipName === this.mipName
        );
      });
  }

  ngOnDestroy() {
    this.mipsService.setMipsData(null);
    this.mipsService.includeSubproposals = false;
  }
}
