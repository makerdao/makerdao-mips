import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LangService } from 'src/app/services/lang/lang.service';

@Component({
  selector: 'app-proposal-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proposal-components.component.html',
  styleUrls: ['./proposal-components.component.scss'],
})
export class ProposalComponentsComponent implements OnInit, OnDestroy {
  @Input() sourceData;
  @Input() titleSidebar = 'Contents';
  @Input() showlevelOne: boolean = false;
  prefixIdLinkSection: string = 'sectionLink-';
  @ViewChild('sectionLinks') sectionLinks;
  active: any;
  @Input() darkMode: boolean = false;

  currentFragment$ = this.route.fragment;

  get allowedDepths() {
    if (this.showlevelOne) {
      return [1, 2, 3];
    }

    return [2, 3];
  }

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private langService: LangService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.langService.currentLang$.subscribe((language: string) => {
        this.translate.use(language);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  scrollFragmentIntoView(fragment: string) {
    const target = this.doc.getElementById(fragment);
    if (target) {
      target.scrollIntoView();
    }
  }

  trackByIdx(model: any, index) {
    return index;
  }
}
