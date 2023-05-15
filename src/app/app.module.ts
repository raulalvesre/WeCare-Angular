import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';

import { AppComponent } from './app.component';
import { FormsComponent } from './users/forms/forms.component';
import { FooterComponent } from './home/footer/footer.component';
import { HeaderComponent } from './home/header/header.component';
import { ContentComponent } from './home/content/content.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { CarouselComponent } from './home/carousel/carousel.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './home/about/about.component';
import { LoginComponent } from './home/login/login.component';
import { UsermainComponent } from './users/usermain/usermain.component';
import { InstitutionsFormsComponent } from './institutions/forms/forms.component';
import { ToastsContainerComponent } from '../shared/components/toasts-container/toasts-container.component';
import { CausesComponent } from './home/causes/causes.component';
import { OpportunitiesSearchComponent } from './users/opportunities/opportunities-search/opportunities-search.component';
import { OpportunityCreateComponent } from './users/opportunities/opportunity-create/opportunity-create.component';
import { OpportunitiesSearchAdminComponent } from './users/opportunities/opportunities-search-admin/opportunities-search-admin.component';
import { OpportunityEditComponent } from './users/opportunities/opportunity-edit/opportunity-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    FormsComponent,
    FooterComponent,
    HeaderComponent,
    ContentComponent,
    NavbarComponent,
    CarouselComponent,
    AboutComponent,
    LoginComponent,
    UsermainComponent,
    InstitutionsFormsComponent,
    CausesComponent,
    OpportunitiesSearchComponent,
    OpportunityCreateComponent,
    OpportunitiesSearchAdminComponent,
    OpportunityEditComponent,
  ],
  providers: [provideEnvironmentNgxMask()],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ToastsContainerComponent,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbCollapseModule
  ]
})
export class AppModule { }
