import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentComponent } from './home/content/content.component';
import { FormsComponent } from './users/forms/forms.component';
import { AboutComponent } from './home/about/about.component';
import { LoginComponent } from './home/login/login.component';
import { UsermainComponent } from './users/usermain/usermain.component';
import { OpportunitiesSearchComponent } from './users/opportunities/opportunities-search/opportunities-search.component';
import { OpportunityCreateComponent } from './users/opportunities/opportunity-create/opportunity-create.component';
import { OpportunitiesSearchAdminComponent } from './users/opportunities/opportunities-search-admin/opportunities-search-admin.component';
import { OpportunityEditComponent } from './users/opportunities/opportunity-edit/opportunity-edit.component';
import { VolunteersIssuesComponent } from './adm/volunteers-issues/volunteers-issues.component';
import { InstitutionsIssuesComponent } from './adm/institutions-issues/institutions-issues.component'
import { ProfileComponent } from './users/profile/profile.component';
import { ScheduledComponent } from './users/opportunities/scheduled/scheduled.component'
import { AccomplishedComponent } from './users/opportunities/accomplished/accomplished.component'
import { InstitutionProfileComponent } from './institutions/institution-profile/institution-profile.component';
const routes: Routes = [
  {
    path: 'home',
    component: ContentComponent
  },
  {
    path: 'user/create',
    component: FormsComponent
  },
  // {
  //   path: 'institution/create',
  //   component: InstitutionsFormsComponent
  // },
  {
    path: 'opportunities',
    component: OpportunitiesSearchComponent
  },
  {
    path: 'opportunities-institution',
    component: OpportunitiesSearchAdminComponent
  },
  {
    path: 'opportunity/create',
    component: OpportunityCreateComponent
  },
  {
    path: 'opportunity/edit/:id',
    component: OpportunityEditComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'profile',
    component: UsermainComponent
  },
  {
    path: 'user-profile',
    component: ProfileComponent
  },
  {
    path: 'institution-profile',
    component: InstitutionProfileComponent
  },
  {
    path: 'issues-volunteers',
    component: VolunteersIssuesComponent
  },
  {
    path: 'issues-institutions',
    component: InstitutionsIssuesComponent
  },
  {
    path: 'opportunities-scheduled',
    component: ScheduledComponent
  },
  {
    path: 'opportunities-accomplished',
    component: AccomplishedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
