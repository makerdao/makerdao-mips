import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/mips/pages/page-not-found/page-not-found.component';
import { HeaderComponent } from './shared/header/header.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/mips/list',
    pathMatch: 'full'
  },
  {
    path: 'mips',
    loadChildren: () => import('./modules/mips/mips.module').then(m => m.MipsModule)
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
