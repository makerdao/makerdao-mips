import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MarkdownService } from 'ngx-markdown';
import { ActivatedRoute, Router } from '@angular/router';
import { MipsService } from '../../services/mips.service';
import { FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';

const preambleDataSample = [
  {
    key: 'MIP#',
    value: '2'
  },
  {
    key: 'Title',
    value: 'Launch Period'
  },
  {
    key: 'Author(s)',
    value: 'Rune Christensen (@Rune23), Charles St.Louis (@CPSTL)'
  },
  {
    key: 'Contributors',
    value: 'Rune Christensen (@Rune23), Charles St.Louis (@CPSTL)'
  },
  {
    key: 'Type',
    value: 'Process'
  },
  {
    key: 'Status',
    value: 'Accepted'
  },
  {
    key: 'Date Proposed',
    value: '2020-04-06'
  },
  {
    key: 'Date Ratified',
    value: '2020-05-02'
  },
  {
    key: 'Dependencies',
    value: 'MIP0, MIP1'
  },
  {
    key: 'Replaces',
    value: 'n/a'
  }
];

@Component({
  selector: 'app-detail-content',
  templateUrl: './detail-content.component.html',
  styleUrls: ['./detail-content.component.scss'],
})
export class DetailContentComponent
  implements OnInit, OnChanges, AfterViewInit {
  gitgubUrl = environment.repoUrl;
  @Input() mip: any;
  links: Link[] = [];
  countLinks: number = 0;
  @ViewChild('preview') preview: TemplateRef<any>;
  overlayRef: OverlayRef | null;
  templatePortal: TemplatePortal<any>;
  content: any;
  triangleUp: boolean;
  triangleLeft: boolean;
  subscription: Subscription;
  @ViewChild('previewRef') previewRef: ElementRef;

  constructor(
    private markdownService: MarkdownService,
    private router: Router,
    private route: ActivatedRoute,
    private mipsService: MipsService,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.overrideDefaultHeadings();
    this.getDefaultLinks();
  }

  ngAfterViewInit() {
  }

  setPreviewFeature() {
    let links = document.getElementsByClassName('linkPreview');

    for (let index = 0; index < links.length; index++) {
      const element = links.item(index);
      element.addEventListener('mouseover', this.displayPreview);
      element.addEventListener('mouseleave', this.closePreview);
    }
  }

  displayPreview = (e: Event) => {
    if (!this.overlayRef) {
      let textContent: string = (e.target as HTMLElement).textContent;

      if (textContent && textContent.trim() != '') {
        this.subscription = this.mipsService
          .getMipBy('mipName', textContent)
          .subscribe((data) => {
            if (data) {
              let posStrategy: FlexibleConnectedPositionStrategyOrigin = e.target as HTMLElement;

              const positionStrategy = this.overlay
                .position()
                .flexibleConnectedTo(posStrategy)
                .withPositions([
                  {
                    originX: 'end',
                    originY: 'bottom',
                    overlayX: 'end',
                    overlayY: 'top',
                  },
                  {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                  },
                  {
                    originX: 'end',
                    originY: 'top',
                    overlayX: 'end',
                    overlayY: 'bottom',
                  },
                  {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'bottom',
                  },
                ]);

              positionStrategy.positionChanges.subscribe((pos) => {
                if (
                  pos.connectionPair.originX === 'end' &&
                  pos.connectionPair.originY === 'bottom' &&
                  pos.connectionPair.overlayX === 'end' &&
                  pos.connectionPair.overlayY === 'top'
                ) {
                  this.triangleUp = true;
                  this.triangleLeft = false;
                } else if (
                  pos.connectionPair.originX === 'start' &&
                  pos.connectionPair.originY === 'bottom' &&
                  pos.connectionPair.overlayX === 'start' &&
                  pos.connectionPair.overlayY === 'top'
                ) {
                  this.triangleUp = true;
                  this.triangleLeft = true;
                } else if (
                  pos.connectionPair.originX === 'end' &&
                  pos.connectionPair.originY === 'top' &&
                  pos.connectionPair.overlayX === 'end' &&
                  pos.connectionPair.overlayY === 'bottom'
                ) {
                  this.triangleUp = false;
                  this.triangleLeft = false;
                } else if (
                  pos.connectionPair.originX === 'start' &&
                  pos.connectionPair.originY === 'top' &&
                  pos.connectionPair.overlayX === 'start' &&
                  pos.connectionPair.overlayY === 'bottom'
                ) {
                  this.triangleUp = false;
                  this.triangleLeft = true;
                }

                let element: HTMLElement = this.previewRef.nativeElement.parentElement.parentElement;
                element.style.marginTop = '17px';
                element.style.marginBottom = '17px';
              });

              this.overlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
              });

              this.overlayRef.attach(
                new TemplatePortal(this.preview, this.viewContainerRef, {
                  $implicit: data,
                })
              );
            }
          });
      }
    }
  };

  closePreview = (e: Event) => {
    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  };

  ngOnChanges() {
    if (this.mip && this.mip.sectionsRaw) {
      this.content = (this.mip.sectionsRaw as []).slice(1).join('\n');
    }

    this.getDefaultLinks();
  }

  onReady() {
    if (this.route.snapshot.fragment) {
      const el = document.getElementById(
        this.route.snapshot.fragment.toString()
      );
      this.moveToElement(el);
    }

    this.searchMips();
    this.setPreviewFeature();
  }

  moveToElement(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  overrideDefaultHeadings() {
    let url = this.router.url.split('#')[0];

    this.markdownService.renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

      let style: string = '';

      if (this.mip.title.localeCompare(text) === 0) {
        style = `style="display:none;"`;
      }

      return `
             <h${level} ${style}>
               <a name="${escapedText}" id="${escapedText}" class="anchor" href="${url}#${escapedText}">
                 <i id="${escapedText}" class="fas fa-link"></i>
               </a>${text}</h${level}>`;
    };
  }

  getDefaultLinks() {
    this.links = [];

    this.markdownService.renderer.link = (
      href: string,
      title: string,
      text: string
    ) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      let id: string = `md-${escapedText}${this.countLinks++}`;

      let link: Link = {
        id: id,
        name: text,
      };

      this.links.push({ ...link });

      return `<a name="${escapedText}" id="${link.id}" class="linkPreview" href="${href}">${text}</a>`;
    };
  }

  searchMipsByNameAndOverrideLink(
    limit,
    page,
    order,
    search,
    filter,
    link: Link
  ): void {
    this.mipsService
      .searchMips(limit, page, order, search, filter)
      .subscribe((data) => {
        if (data.items && data.items[0]) {
          // override link in DOM
          let elem = document.getElementById(link.id);
          elem.setAttribute('href', '/mips/details/' + data.items[0].mipName);
        }
      });
  }

  searchMips() {
    this.links.forEach((link) => {
      if (!link.name.includes('Template')) {
        this.mipsService.getMipByFilename(link.name).subscribe((data) => {

          let elem = document.getElementById(link.id);

          if (data.mipName) {
            elem.setAttribute('href', `/mips/details/${data.mipName}`);
          } else {
            elem.setAttribute(
              'href',
              `${this.gitgubUrl}/${this.mip.filename}`
            );
          }
        }, err => {
          let elem = document.getElementById(link.id);
          elem.setAttribute(
            'href',
            `${this.gitgubUrl}/${this.mip.mipName}/${link.name}`
          );
        });
      } else {
        let elem = document.getElementById(link.id);

        if (link.name.includes('.md')) {
          elem.setAttribute(
            'href',
            `${this.gitgubUrl}/${this.mip.mipName}/${link.name}`
          );
        } else {
          elem.setAttribute(
            'href',
            `${this.gitgubUrl}/${this.mip.mipName}/${link.name}.md`
          );
        }
      }
    });
  }
}

interface Link {
  id: string;
  name: string;
}
