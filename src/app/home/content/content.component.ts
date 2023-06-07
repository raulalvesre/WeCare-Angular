import {Component} from '@angular/core';
import {VolunteerOpportunity} from 'src/shared/models/volunteer-opportunity.model';
import {AccessService} from 'src/shared/services/access.service';
import {CandidateService} from 'src/shared/services/candidate.service';
import {VolunteerOpportunityService} from 'src/shared/services/volunteer-opportunity.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {

  userIsCandidate: boolean;
  recommendedOpportunities: VolunteerOpportunity[];
  latestOpportunities: VolunteerOpportunity[];
  userRole: string;

  constructor(
    private candidateService: CandidateService,
    private accessService: AccessService,
    private opportunityService: VolunteerOpportunityService
  ) {
    this.userIsCandidate = accessService.getCurrentUser()?.role === 'CANDIDATE';

    if (!this.userIsCandidate) {
      opportunityService.search({
        'orderBy': 'CreationDate',
        'orderDirection': 'Descending'
      }).subscribe(ops => this.latestOpportunities = ops.data)
    } else {
      candidateService.getCandidateRecomendedOpportunities().subscribe(ops => this.recommendedOpportunities = ops.data)
      opportunityService.search({
        'candidateNotRegistered': accessService.getCurrentUser().id,
        'orderBy': 'CreationDate',
        'orderDirection': 'Descending'
      }).subscribe(ops => this.latestOpportunities = ops.data)
    }
  }

  ngOnInit(): void {
    this.configureMenuForCurrentUser();
  }

  private configureMenuForCurrentUser() {
    const currentUser = this.accessService.getCurrentUser();

    if (currentUser == null) {
      this.userRole = 'UNKNOW';
    } else {
      this.userRole = currentUser.role;
    }
  }
}
