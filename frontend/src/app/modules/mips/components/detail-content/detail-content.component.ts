import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MarkdownService } from 'ngx-markdown';
import { ActivatedRoute, Router } from '@angular/router';
import { MipsService } from '../../services/mips.service';

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
  styleUrls: ['./detail-content.component.scss']
})
export class DetailContentComponent implements OnInit, OnChanges {
  gitgubUrl = environment.repoUrl;
  @Input() mip: any;
  links: Link[] = [];
  countLinks: number = 0;

  constructor(
    private markdownService: MarkdownService,
    private router: Router,
    private route: ActivatedRoute,
    private mipsService: MipsService
  ) { }

  ngOnInit(): void {
    this.overrideDefaultHeadings();
    this.getDefaultLinks();
  }

  ngOnChanges() {
    this.getDefaultLinks();
  }

  onReady() {
    if (this.route.snapshot.fragment) {
      const el = document.getElementById(this.route.snapshot.fragment.toString());
      this.moveToElement(el);
    }
    this.searchMips();

  }

  moveToElement(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

  overrideDefaultHeadings() {
    let url = this.router.url.split('#')[0];

    this.markdownService.renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

      return `
             <h${level}>
               <a name="${escapedText}" id="${escapedText}" class="anchor" href="${url}#${escapedText}">
                 <i id="${escapedText}" class="fas fa-link"></i>
               </a>
               ${text}
             </h${level}>`;
    };
  }

  getDefaultLinks() {
    this.links = [];

    this.markdownService.renderer.link = (href: string, title: string, text: string) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      let id: string = `md-${escapedText}${this.countLinks++}`;

      let link: Link = {
        id: id,
        name: text
      };

      this.links.push({...link});

      return `<a name="${escapedText}" id="${link.id}" class="anchor" href="${href}">${text}</a>`;
    };
  }



  searchMipsByNameAndOverrideLink(limit, page, order, search, filter, link: Link): void {
    this.mipsService.searchMips(limit, page, order, search, filter)
    .subscribe(data => {
      if (data.items && data.items[0]) {
        // override link in DOM
        let elem = document.getElementById(link.id);
        elem.setAttribute('href', '/mips/details/' + data.items[0]._id);
      }
    });
  }

  searchMips() {
    this.links.forEach(link => {
      let filter = {
        contains: [],
      };

      filter.contains.push({field: 'mipName', value: link.name});
      this.searchMipsByNameAndOverrideLink(0, 0, 'mipName', '', filter, link);
    })
  }

}

interface Link {
  id: string;
  name: string;
}
