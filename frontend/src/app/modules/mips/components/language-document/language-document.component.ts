import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/data-types/languages';

@Component({
  selector: 'app-language-document',
  templateUrl: './language-document.component.html',
  styleUrls: ['./language-document.component.scss'],
})
export class LanguageDocumentComponent implements OnChanges {
  @Input() languagesAvailables: any[];
  @Input() documentLanguage: Language;
  @Input() darkMode: boolean;
  @Output('updateDocumentLanguage') updateDocumentLanguage: EventEmitter<
    any
  > = new EventEmitter();

  languagesList: Language[] = [];
  languagesNames = {};

  constructor(translate: TranslateService) {
    Object.keys(Language).forEach((key) => {
      translate.get(key).subscribe((transaltedLanguageName: string) => {
        this.languagesNames[Language[key]] = transaltedLanguageName;
      });
    });
  }

  handleLinkClicked(itemClicked) {
    if (Object.values(Language).includes(itemClicked)) {
      this.updateDocumentLanguage.emit(itemClicked as Language);
    }
  }

  ngOnChanges() {
    this.languagesList = this.languagesAvailables.reduce(
      (acc, item) =>
        item.language === this.documentLanguage ? acc : [...acc, item.language],
      []
    );
  }
}
