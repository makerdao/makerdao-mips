import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/data-types/languages';

@Component({
  selector: 'app-language-document',
  templateUrl: './language-document.component.html',
  styleUrls: ['./language-document.component.scss'],
})
export class LanguageDocumentComponent {
  @Input() languagesAvailables: any[];
  languagesNames = {};

  constructor(translate: TranslateService) {
    Object.keys(Language).forEach((key) => {
      translate
        .get(key)
        .subscribe((transaltedLanguageName: string) => {
          this.languagesNames[Language[key]] = transaltedLanguageName;
        });
    });
  }

  handleLinkClicked(itemClicked) {
   
  }
}
