import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';



@Component({
  selector: 'app-opportunity-applied-users',
  templateUrl: './opportunity-applied-users.component.html',
  styleUrls: ['./opportunity-applied-users.component.css']
})

export class OpportunityAppliedUsersComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  volunteerOpportunityId = -1;
  volunteerOpportunity: VolunteerOpportunity;

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
  ) {
    this.volunteerOpportunityId = Number(this.route.snapshot.params['id']);
    volunteerOpportunityService.searchById({volunteerOpportunityId: this.volunteerOpportunityId}).subscribe(ops => this.volunteerOpportunity = ops)
}
  
}
