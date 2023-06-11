import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from "@angular/common/locales/pt";

import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

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
import { OpportunitiesSearchComponent } from './users/opportunities/opportunities-search/opportunities-search.component';
import { OpportunityCreateComponent } from './users/opportunities/opportunity-create/opportunity-create.component';
import { OpportunitiesSearchAdminComponent } from './users/opportunities/opportunities-search-admin/opportunities-search-admin.component';
import { OpportunityEditComponent } from './users/opportunities/opportunity-edit/opportunity-edit.component';
import { InstitutionsIssuesComponent } from './adm/institutions-issues/institutions-issues.component';
import { VolunteersIssuesComponent } from './adm/volunteers-issues/volunteers-issues.component';
import { ProfileComponent } from './users/profile/profile.component';
import { AccomplishedComponent } from './users/opportunities/accomplished/accomplished.component';
import { ScheduledComponent } from './users/opportunities/scheduled/scheduled.component';
import { InstitutionProfileComponent } from './institutions/institution-profile/institution-profile.component';
import { OpportunityInviteComponent } from './users/opportunities/opportunity-invite/opportunity-invite.component';
import { FeaturedCausesComponent } from './home/featured-causes/featured-causes.component';
import { CardSliderComponent } from './home/slider/card-slider/card-slider.component';
import { CardSliderAltComponent } from './home/slider/card-slider-alt/card-slider-alt.component';
import { CardSliderPhotosComponent } from './home/slider/card-slider-photos/card-slider-photos.component'
import { PasswordRecoveryComponent } from './home/password-recovery/password-recovery.component';
import { ActivateAccountComponent } from './home/activate-account/activate-account.component';
import { VolunteerSearchComponent } from './institutions/volunteers/volunteer-search/volunteer-search.component';
import { OpportunityAppliedUsersComponent } from './users/opportunities/opportunity-applied-users/opportunity-applied-users.component';
import {OpportunityModalComponent} from "../shared/components/opportunity-modal/opportunity-modal.component";
import { CertificateComponentComponent } from './home/certificate-component/certificate-component.component';

registerLocaleData(localePt);

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
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
    OpportunitiesSearchComponent,
    OpportunityCreateComponent,
    OpportunitiesSearchAdminComponent,
    OpportunityEditComponent,
    InstitutionsIssuesComponent,
    VolunteersIssuesComponent,
    ProfileComponent,
    AccomplishedComponent,
    ScheduledComponent,
    InstitutionProfileComponent,
    OpportunityInviteComponent,
    FeaturedCausesComponent,
    CardSliderComponent,
    CardSliderAltComponent,
    CardSliderPhotosComponent,
    PasswordRecoveryComponent,
    ActivateAccountComponent,
    VolunteerSearchComponent,
    OpportunityAppliedUsersComponent,
    CertificateComponentComponent,

  ],
  providers: [
    provideNgxMask(),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
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
        NgbCollapseModule,
        OpportunityModalComponent,

    ]
})
export class AppModule {
}
