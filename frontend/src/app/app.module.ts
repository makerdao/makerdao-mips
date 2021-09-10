import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClientModule  } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ObserveVisibilityDirective } from './directives/observe-visibility.directive';
import { NavMenuComponent } from './shared/nav-menu/nav-menu.component';
import { MenuComponent } from './shared/menu/menu.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { MatRippleModule } from '@angular/material/core';
import { MdFeedbackComponent } from './shared/md-feedback/md-feedback.component';
import { MdFeedbackDialogComponent } from './shared/md-feedback/md-feedback-dialog/md-feedback-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ObserveVisibilityDirective,
    NavMenuComponent,
    MenuComponent,
    MdFeedbackComponent,
    MdFeedbackDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
    OverlayModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
