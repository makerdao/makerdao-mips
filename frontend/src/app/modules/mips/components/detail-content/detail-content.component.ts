import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MarkdownService } from 'ngx-markdown';
import { ActivatedRoute, Router } from '@angular/router';

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
export class DetailContentComponent implements OnInit {
  gitgubUrl = environment.repoUrl;
  @Input() mip: any;
  constructor(
    private markdownService: MarkdownService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let url = this.router.url.split('#')[0];

    this.markdownService.renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

      return `
             <h${level}>
               <a name="${escapedText}" id="${escapedText}" class="anchor" href="${url}#${escapedText}">
                 <i id="${escapedText}" class="material-icons">link</i>
               </a>
               ${text}
             </h${level}>`;
    };
  }

  onReady() {
    if (this.route.snapshot.fragment) {
      const el = document.getElementById(this.route.snapshot.fragment.toString());
      this.moveToElement(el);
    }
  }

  moveToElement(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

}
