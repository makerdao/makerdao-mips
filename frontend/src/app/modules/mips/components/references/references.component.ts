import { Component, Input, OnChanges } from '@angular/core';
import { UrlService } from 'src/app/services/url/url.service';

import { environment as env } from '../../../../../environments/environment';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
})
export class ReferencesComponent implements OnChanges {
  @Input() references: any[];
  @Input() mipName: string;
  mdViewerPath = '/mips/md-viewer?mdUrl=';
  gitHubUrl = env.repoUrl;
  updatedReferences: any[];

  constructor(protected urlService: UrlService) {}

  ngOnChanges(): void {

    const temporalReferences = this.references.filter((item) => {
      return item.name !== '\n';
    });

    this.updatedReferences = temporalReferences.map((reference) => {
      const proccesedLink = this.urlService.processLink(reference.link);

      return { ...reference, proccesedLink };
    });
  }

  handleLinkClicked(link) {
    this.urlService.goToUrl(link);
  }
}
