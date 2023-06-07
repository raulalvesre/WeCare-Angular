import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
import { Candidate } from 'src/shared/models/candidate.model';



@Component({
  selector: 'app-opportunity-applied-users',
  templateUrl: './opportunity-applied-users.component.html',
  styleUrls: ['./opportunity-applied-users.component.css']
})

export class OpportunityAppliedUsersComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);

  volunteerOpportunityId: number;

  volunteerOpportunity: VolunteerOpportunity;
  appliedCandidates: Candidate[];

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
  ) {
    this.volunteerOpportunityId = Number(this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.searchCandidateAppliedOpportunities();
  }

  private searchCandidateAppliedOpportunities() {
    this.volunteerOpportunityService.searchAppliedCandidates(this.volunteerOpportunityId)
      .subscribe({
        next: candidates => {
          this.appliedCandidates = candidates;
          console.log(this.appliedCandidates);
        },
        error: error => {
          console.error(error);
        }
      });
  }

}
