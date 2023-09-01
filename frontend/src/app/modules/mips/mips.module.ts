import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MipsRoutingModule } from './mips-routing.module';
import { ListComponent } from './components/list/list.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { StatusComponent } from './components/status/status.component';
import { SocialComponent } from './components/social/social.component';
import { SearchComponent } from './components/search/search.component';
import { FilterComponent } from './components/filter/filter.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { MipsPaginationComponent } from './components/mips-pagination/mips-pagination.component';
import { ProposalComponentsComponent } from './components/proposal-components/proposal-components.component';
import { MipDetailsComponent } from './components/mip-details/mip-details.component';
import { PullRequestHistoryComponent } from './components/pull-request-history/pull-request-history.component';
import { DetailContentComponent } from './components/detail-content/detail-content.component';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchMobileComponent } from './components/search-mobile/search-mobile.component';
import { OrderMobileComponent } from './components/order-mobile/order-mobile.component';
import { DetailsMobilesButtonsComponent } from './components/details-mobiles-buttons/details-mobiles-buttons.component';
import { MarkdownModule } from 'ngx-markdown';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MatIconModule } from '@angular/material/icon';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { FilterListItemComponent } from './components/filter-list-item/filter-list-item.component';
import { FilterListHostDirective } from './directives/filter-list-host.directive';
import { MdCheckboxComponent } from './components/md-checkbox/md-checkbox.component';
import { MdCheckboxMobileComponent } from './components/md-checkbox-mobile/md-checkbox-mobile.component';
import { SubproposalsComponent } from './components/subproposals/subproposals.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { SideContentComponent } from './components/side-content/side-content.component';
import { ReferencesComponent } from './components/references/references.component';
import { OptionAutocompleteComponent } from './components/option-autocomplete/option-autocomplete.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { AutocompleteContentDirective } from './directives/autocomplete-content.directive';
import { AutocompleteDirective } from './directives/autocomplete.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { FeedbackDialogComponent } from './components/feedback/feedback-dialog/feedback-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor';
import { FormattingMdDirective } from './directives/formatting-md.directive';
import { ListSubsetComponent } from './components/list/list-subset/list-subset.component';
import { ListSubproposalComponent } from './components/list/list-subproposal/list-subproposal.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ListMipsetModeComponent } from './components/list-mipset-mode/list-mipset-mode.component';
import { SublistComponent } from './components/sublist/sublist.component';
import { TagMipsetPipe } from './pipes/tag-mipset.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { MdObserveVisibilityDirective } from './directives/md-observe-visibility.directive';
import { MdTooltipDirective } from './directives/md-tooltip.directive';
import { MdTooltipComponent } from './components/md-tooltip/md-tooltip.component';
import { ButtonTopComponent } from './components/button-top/button-top.component';
import { AscDesComponent } from './components/asc-des/asc-des.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MdRadioButtonComponent } from './components/md-radio-button/md-radio-button.component';
import { LanguageDocumentComponent } from './components/language-document/language-document.component';
import { ListMultipleQueriesComponent } from './components/list-multiple-queries/list-multiple-queries.component';
import { NewsComponent } from './components/news/news.component';
import { MdInformationComponent } from './components/md-information/md-information.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MipSectionsPipe } from './pipes/mip-sections.pipe';

@NgModule({
  declarations: [
    ListComponent,
    StatusComponent,
    SocialComponent,
    SearchComponent,
    FilterComponent,
    ListPageComponent,
    MipsPaginationComponent,
    ProposalComponentsComponent,
    MipDetailsComponent,
    PullRequestHistoryComponent,
    DetailContentComponent,
    DetailsPageComponent,
    SearchMobileComponent,
    OrderMobileComponent,
    DetailsMobilesButtonsComponent,
    FeedbackComponent,
    FilterListComponent,
    FilterListItemComponent,
    FilterListHostDirective,
    MdCheckboxComponent,
    MdCheckboxMobileComponent,
    SubproposalsComponent,
    SideContentComponent,
    ReferencesComponent,
    FeedbackDialogComponent,
    OptionAutocompleteComponent,
    AutocompleteComponent,
    AutocompleteContentDirective,
    AutocompleteDirective,
    FilterPipe,
    FormattingMdDirective,
    ListSubsetComponent,
    ListSubproposalComponent,
    PageNotFoundComponent,
    ListMipsetModeComponent,
    SublistComponent,
    TagMipsetPipe,
    MdObserveVisibilityDirective,
    MdTooltipDirective,
    MdTooltipComponent,
    ButtonTopComponent,
    AscDesComponent,
    MdRadioButtonComponent,
    LanguageDocumentComponent,
    ListMultipleQueriesComponent,
    MdInformationComponent,
    NewsComponent,
    MipSectionsPipe,
  ],
  imports: [
    CommonModule,
    MipsRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    InfiniteScrollModule,
    MatIconModule,
    MatTooltipModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
    OverlayModule,
    MatDialogModule,
    ReactiveFormsModule,
    ContenteditableValueAccessorModule,
    MatExpansionModule,
    MatRippleModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class MipsModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
