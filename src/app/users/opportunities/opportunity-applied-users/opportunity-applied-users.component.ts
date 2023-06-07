import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
import { VolunteerOpportunityRegistration } from 'src/shared/models/candidate-volunteer-opportunity.model';
import { ImageService } from 'src/shared/services/image.service';
import { OpportunityRegistrationService } from 'src/shared/services/opportunity-registration.service';
import { HttpStatusCode } from '@angular/common/http';
import { ToastService } from 'src/shared/services/toast.service';
import { OpportunityCause } from 'src/shared/models/opportunity-cause.model';
import { Qualification } from 'src/shared/models/qualification.model';
import {ParticipationCertificateService} from "../../../../shared/services/participation.certificate.service";
import {ParticipationCertificate} from "../../../../shared/models/participation-certificate.model";
import {Page} from "../../../../shared/models/page.model";



@Component({
  selector: 'app-opportunity-applied-users',
  templateUrl: './opportunity-applied-users.component.html',
  styleUrls: ['./opportunity-applied-users.component.css']
})

export class OpportunityAppliedUsersComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  volunteerOpportunityId: number;
  currentRegistrationStatus = 'PENDING';
  volunteerOpportunity: VolunteerOpportunity;
  registrationsOpportunities: VolunteerOpportunityRegistration[] = [];
  opportunityCertificates: ParticipationCertificate[] = [];
  isLoading: boolean;

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
    private opportunityRegistrationService: OpportunityRegistrationService,
    public imageService: ImageService,
    private toastService: ToastService,
    private participationCertificateService: ParticipationCertificateService
  ) {
    this.volunteerOpportunityId = parseInt(this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.searchVolunteerOpportunity();
    this.participationCertificateService.searchParticipationCertificates({ opportunityId: this.volunteerOpportunityId })
      .subscribe({next: (certificatePage: Page<ParticipationCertificate[]>) => {
          this.opportunityCertificates = certificatePage.data;
        },
        error: err => {
          console.error(err);
        }});
    this.searchCandidateAppliedOpportunities();
  }

  changeRegistrationStatus(status: string) {
    this.currentRegistrationStatus = status;

    this.searchCandidateAppliedOpportunities();
  }

  denyRegistration(registrationOpportunity: VolunteerOpportunityRegistration) {
    this.opportunityRegistrationService.denyOpportunityRegistration(registrationOpportunity.id, 'Candidato recusado')
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Candidato recusado com sucesso', { classname: 'bg-success text-light', delay: 5000 });

            setTimeout(() => {
              location.reload();
            }, 500);
          }
        }, error: error => {
          console.error(error);
        }
      });
  }

  acceptRegistration(registrationOpportunity: VolunteerOpportunityRegistration) {
    this.opportunityRegistrationService.acceptOpportunityRegistration(registrationOpportunity.id, 'Candidato aceito')
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Candidato aceito com sucesso', { classname: 'bg-success text-light', delay: 5000 });

            setTimeout(() => {
              location.reload();
            }, 500);
          }
        }, error: error => {
          console.error(error);
        }
      });
  }

  causesInterestedIn(opportunityCauses: OpportunityCause[]) {
    return opportunityCauses
      .map(opportunityCause => opportunityCause.name)
      .join(', ');
  }

  qualifications(qualifications: Qualification[]) {
    return qualifications
      .map(qualification => qualification.name)
      .join(', ');
  }

  opportunityHasAlreadyHappened(opportuntity: VolunteerOpportunity) {
    return new Date(opportuntity.opportunityDate) <= new Date();
  }

  private searchVolunteerOpportunity() {
    this.volunteerOpportunityService.searchById({ volunteerOpportunityId: this.volunteerOpportunityId })
      .subscribe({
        next: volunteerOpportunity => {
          this.volunteerOpportunity = volunteerOpportunity;
          console.log(volunteerOpportunity);

        },
        error: error => {
          console.error(error);
        }
      });
  }

  private searchCandidateAppliedOpportunities() {
    console.log('searchCandidateAppliedOpportunities');
    this.isLoading = true;
    console.log(this.volunteerOpportunityId);
    this.volunteerOpportunityService.searchRegistrations(
      this.volunteerOpportunityId,
      this.currentRegistrationStatus
    )
      .subscribe({
        next: page => {
          if (Array.isArray(page.data)) {
            this.registrationsOpportunities = page.data;
            console.log(this.registrationsOpportunities);
          }
        },
        error: error => {
          console.error(error);
        }
      }).add(() => this.isLoading = false);
  }

  emitCertificate(opportunityRegistration: VolunteerOpportunityRegistration) {
    this.participationCertificateService.emitCertificate(opportunityRegistration.id, [])
      .subscribe({
        next: (certificate: ParticipationCertificate) => {
          this.toastService.show('Certificado emitido com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          opportunityRegistration.institutionEmittedCertificate = true;
        },
        error: (httpErrorResponse) => {
          console.error(httpErrorResponse);
          if (httpErrorResponse.status == HttpStatusCode.Conflict) {
            this.toastService.show('Certificado já foi emitido', { classname: 'bg-danger text-light', delay: 5000 });
          }
        }
      })
  }

  candidateAlreadyHasCertificate(candidateId) {
    return this.opportunityCertificates.some(x => x.registration.candidate.id == candidateId);
  }
}
