import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MipsRoutingModule { }
