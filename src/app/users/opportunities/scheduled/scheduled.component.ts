import { Component, OnInit } from '@angular/core';
import { Page } from 'src/shared/models/page.model';
import { VolunteerRegistration } from 'src/shared/models/volunteer-registration.model';
import { AccessService } from 'src/shared/services/access.service';
import { CandidateService } from 'src/shared/services/candidate.service';

interface Agendado {
  name: string;
  type: number;
  date: string;
  certificate: boolean;
}

@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.css']
})
export class ScheduledComponent implements OnInit {

  readonly opportunityDescriptionLength = 50;

  volunteerRegistrations: VolunteerRegistration[] = [];

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;

  constructor(
    private candidateService: CandidateService,
    private accessService: AccessService
  ) { }

  ngOnInit(): void {
    this.loadOpportunities();
  }

  loadMoreOpportunities() {
    this.pageNumber += 1;

    this.loadOpportunities();
  }

  volunteerOpportunityAddress(volunteerRegistration: VolunteerRegistration) {
    const address = volunteerRegistration.opportunity.address;

    return `${address.neighborhood} (${address.city} - ${address.state})`;
  }

  registrationStatus(volunteerRegistration: VolunteerRegistration) {
    switch (volunteerRegistration.status) {
      case 'PENDING':
        return 'Pendente';
      case 'ACCEPTED':
        return 'Aceita';
      case 'DENIED':
        return 'Negada';
      case 'CANCELED':
        return 'Cancelada';
      default:
        return 'Desconhecido'
    }
  }

  private loadOpportunities() {
    const currentUser = this.accessService.getCurrentUser();

    this.candidateService
      .searchPendingRegistrations({
        candidateId: currentUser.id,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
      .subscribe({
        next: (page: Page<VolunteerRegistration[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.volunteerRegistrations.length == 0) {
              this.volunteerRegistrations = page.data;
            } else {
              this.volunteerRegistrations.push(...page.data);
            }
          }
        }
      });

    this.candidateService
      .searchAcceptedRegistrations({
        candidateId: currentUser.id,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
      .subscribe({
        next: (page: Page<VolunteerRegistration[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.volunteerRegistrations.length == 0) {
              this.volunteerRegistrations = page.data;
            } else {
              this.volunteerRegistrations.push(...page.data);
            }
          }
        }
      });

    this.candidateService
      .searchDeniedRegistrations({
        candidateId: currentUser.id,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
      .subscribe({
        next: (page: Page<VolunteerRegistration[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.volunteerRegistrations.length == 0) {
              this.volunteerRegistrations = page.data;
            } else {
              this.volunteerRegistrations.push(...page.data);
            }
          }
        }
      });

    this.candidateService
      .searchCanceledRegistrations({
        candidateId: currentUser.id,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
      .subscribe({
        next: (page: Page<VolunteerRegistration[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.volunteerRegistrations.length == 0) {
              this.volunteerRegistrations = page.data;
            } else {
              this.volunteerRegistrations.push(...page.data);
            }
          }
        }
      });
  }
}
