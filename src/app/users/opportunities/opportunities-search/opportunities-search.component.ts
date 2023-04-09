import { Component, OnInit } from '@angular/core';
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { Page } from 'src/shared/models/page.model';
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';

@Component({
  selector: 'app-opportunities-search',
  templateUrl: './opportunities-search.component.html',
  styleUrls: ['./opportunities-search.component.css']
})
export class OpportunitiesSearchComponent implements OnInit {

  volunteerOpportunities: VolunteerOpportunity[];

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService
  ) { }

  ngOnInit(): void {
    this.volunteerOpportunityService.search()
      .subscribe({
        next: (page: Page<VolunteerOpportunity[]>) => {
          if (page.data != null) {
            this.volunteerOpportunities = page.data;

            console.log(this.volunteerOpportunities);
          }
        }
      });
  }

}
