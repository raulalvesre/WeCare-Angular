import {Component} from '@angular/core';
import {ParticipationCertificate} from "../../../shared/models/participation-certificate.model";
import {ParticipationCertificateService} from "../../../shared/services/participation.certificate.service";
import {ActivatedRoute} from "@angular/router";
import {InstitutionService} from "../../../shared/services/institution.service";
import {Institution} from "../../../shared/models/institution.model";

@Component({
  selector: 'app-certificate-component',
  templateUrl: './certificate-component.component.html',
  styleUrls: ['./certificate-component.component.css']
})
export class CertificateComponentComponent {

  participationCertificate: ParticipationCertificate;
  authenticityCode: string;
  isLoading: boolean;

  constructor(private certificateService: ParticipationCertificateService, private route: ActivatedRoute, private institutionService: InstitutionService) {
    this.authenticityCode = this.route.snapshot.params['authenticityCode'];

  }

  ngOnInit() {
    this.isLoading = true;
    this.certificateService.getByAuthenticityCode(this.authenticityCode)
      .subscribe({
        next: (certificate: ParticipationCertificate) => {
          this.institutionService.get(certificate.registration.opportunity.institutionId)
            .subscribe({next: (inst: Institution) => {
              certificate.registration.opportunity.institution = inst;
              this.participationCertificate = certificate;
          }})
        }
      })
      .add(() => this.isLoading = false);
  }

}
