import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MipsRoutingModule } from './mips-routing.module';
import { ListComponent } from './components/list/list.component';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    MipsRoutingModule,
    MatTableModule
  ]
})
export class MipsModule { }
