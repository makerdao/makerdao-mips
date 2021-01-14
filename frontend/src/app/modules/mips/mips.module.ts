import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MipsRoutingModule } from './mips-routing.module';
import { ListComponent } from './components/list/list.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { StatusComponent } from './components/status/status.component';
import { SocialComponent } from './components/social/social.component';
import { SearchComponent } from './components/search/search.component';
import { FilterComponent } from './components/filter/filter.component';


@NgModule({
  declarations: [ListComponent, StatusComponent, SocialComponent, SearchComponent, FilterComponent],
  imports: [
    CommonModule,
    MipsRoutingModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class MipsModule { }
