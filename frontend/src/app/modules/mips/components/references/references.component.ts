import { Component, Input, OnInit } from '@angular/core';

import { environment as env } from '../../../../../environments/environment';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
})
export class ReferencesComponent implements OnInit {
  @Input() references: any[];
  @Input() mipName: string;
  mdViewerPath="/mips/md-viewer?mdUrl="
  gitHubUrl = env.repoUrl;

  constructor() {}

  ngOnInit(): void {
    let referencesTemp: any[] = this.references.filter((item) => {
      return item.name !== '\n';
    });

    this.references = [...referencesTemp];
  }
}
