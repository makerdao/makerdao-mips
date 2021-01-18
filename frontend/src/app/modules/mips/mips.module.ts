import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MipsRoutingModule } from './mips-routing.module';
import { ListComponent } from './components/list/list.component';
import { MatTableModule } from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
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
    DetailsPageComponent
  ],
  imports: [
    CommonModule,
    MipsRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ]
})
export class MipsModule { }
