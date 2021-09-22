import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MipsService } from '../../services/mips.service';
import { MarkdownService } from 'ngx-markdown';
import { MetadataShareService } from '../../services/metadata-share.service';
import { UrlService } from 'src/app/services/url/url.service';
import { LangService } from 'src/app/services/lang/lang.service';

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

  constructor(
    private mipsService: MipsService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private markdownService: MarkdownService,
    private metadataShareService: MetadataShareService,
    private urlService: UrlService,
    private langService: LangService
  ) {}

  ngOnInit(): void {
    this.loadingUrl = true;

    this.activedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('name')) {
        this.mipName = paramMap.get('name');
        this.total = this.mipsService.getTotal();
        this.loadData();
        this.moveToElement();
      }
    });

    this.activedRoute.queryParamMap.subscribe((queryParam) => {
      if (queryParam.has('mdUrl')) {
        this.loadingUrl = true;
        const url = queryParam.get('mdUrl');

        const shouldUpdateUrl = this.urlService.getMdFromGithubUrl(url);

        if (shouldUpdateUrl) {
          this.router.navigateByUrl(this.urlService.transformLinkForMd(url));
        } else this.mdUrl = url;
        this.moveToElement();
      }
    });
  }

  headingListUpdate(event) {
    this.loadingUrl = false;
    this.sections = null;

    if (this.mdUrl) {
      this.sections = event;
    }
  }

  loadData(): void {
    this.mipsService.getMip(this.mipName).subscribe(
      (data) => {
        this.mip = data.mip;

        this.references = data.mip?.references?.filter((item) => {
          return item.name !== '\n';
        });

        // const regEx = new RegExp('(.)*');
        // this.mip.file = this.mip.file.replace(regEx, ' ');
        this.sections = this.mip.sections;
        let indexPreambleSection: number = (this.sections as []).findIndex(
          (i: any) => i.heading === 'Preamble'
        );

        if (indexPreambleSection !== -1) {
          (this.sections as []).splice(indexPreambleSection, 1);
        }

        let indexPreambleHeading: number = (this.mip.sectionsRaw as [

        ]).findIndex((i: any) => (i as string).includes('Preamble'));

        if (indexPreambleHeading !== -1) {
          (this.mip.sectionsRaw as []).splice(indexPreambleHeading, 2); // delete Preamble heading and its content
        }

        let indexReferencesSection: number = (this.sections as []).findIndex(
          (i: any) => i.heading === 'References'
        );

        if (indexReferencesSection !== -1) {
          (this.sections as []).splice(indexReferencesSection, 1);
        }

        let indexReferencesHeading: number = (this.mip.sectionsRaw as [

        ]).findIndex((i: any) => (i as string).includes('References'));

        if (indexReferencesHeading !== -1) {
          (this.mip.sectionsRaw as []).splice(indexReferencesHeading, 2);
        }

        this.pullrequest = data.pullRequests;
        this.subproposals = data.subproposals;

        if (!this.mipsService.getMipsData()) {
          this.getMips();
        } else if (this.mip.proposal && !this.mipsService.includeSubproposals) {
          this.mipsService.includeSubproposals = true;
          this.getMips();
        }

        this.setMetadataShareable();
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

  setMetadataShareable() {
    let sentenceSummaryHTML = this.markdownService.compile(
      this.mip.sentenceSummary
    );
    let elemTemp: HTMLElement = document.createElement('span');
    elemTemp.innerHTML = sentenceSummaryHTML;
    let sentenceSummaryText: string = elemTemp.textContent;

    this.metadataShareService.title = this.mip.title;
    this.metadataShareService.description = sentenceSummaryText;
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
