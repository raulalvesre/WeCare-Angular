import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentComponent } from './home/content/content.component';
import { FormsComponent } from './users/forms/forms.component';
import { AboutComponent } from './home/about/about.component';
import { LoginComponent } from './home/login/login.component';
import { UsermainComponent } from './users/usermain/usermain.component';
import { CausesComponent } from './home/causes/causes.component';
import { OpportunitiesSearchComponent } from './users/opportunities/opportunities-search/opportunities-search.component';
import { OpportunityCreateComponent } from './users/opportunities/opportunity-create/opportunity-create.component';
import { OpportunitiesSearchAdminComponent } from './users/opportunities/opportunities-search-admin/opportunities-search-admin.component';
import { OpportunityEditComponent } from './users/opportunities/opportunity-edit/opportunity-edit.component';

const routes: Routes = [
  {
    path: 'home',
    component: ContentComponent
  },
  {
    path: 'user/create',
    component: FormsComponent
  },
  {
    path: 'opportunities',
    component: OpportunitiesSearchComponent
  },
  {
    path: 'opportunities-admin',
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
    path: 'causes',
    component: CausesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
