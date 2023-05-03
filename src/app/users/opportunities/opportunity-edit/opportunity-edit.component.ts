import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Institution } from 'src/shared/models/institution.model';
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';

@Component({
  selector: 'app-opportunity-edit',
  templateUrl: './opportunity-edit.component.html',
  styleUrls: ['./opportunity-edit.component.css']
})
export class OpportunityEditComponent implements OnInit {

  loggedInstitution: Institution;
  volunteerOpportunityId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private volunteerOpportunityService: VolunteerOpportunityService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(parameters => {
      this.volunteerOpportunityId = parameters.id;

      this.searchOpportunity();
    });
  }

  searchOpportunity() {
    this.volunteerOpportunityService
      .searchById({ volunteerOpportunityId: this.volunteerOpportunityId })
      .subscribe({
        next: volunteerOpportunity => {
          console.log(volunteerOpportunity);
        }
      });
  }

}
