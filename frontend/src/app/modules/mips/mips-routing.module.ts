import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MdViewerComponent } from './components/md-viewer/md-viewer.component';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListPageComponent
  },
  {
    path: 'details/:name',
    component: DetailsPageComponent
  },
  {
    path: 'md-viewer/:name',
    component: MdViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MipsRoutingModule { }
