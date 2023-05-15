import { Component, OnInit } from '@angular/core';
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { Page } from 'src/shared/models/page.model';
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
import { ToastService } from 'src/shared/services/toast.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FileService } from 'src/shared/services/file.service';

@Component({
  selector: 'app-opportunities-search',
  templateUrl: './opportunities-search.component.html',
  styleUrls: ['./opportunities-search.component.css']
})
export class OpportunitiesSearchComponent implements OnInit {

  readonly opportunityDescriptionLength = 50;

  volunteerOpportunities: VolunteerOpportunity[] = [];

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
    private toastService: ToastService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.loadOpportunities();
  }

  getOpportunityDescription(volunteerOpportunity: VolunteerOpportunity): string {
    return volunteerOpportunity.collapseDescription
      ? volunteerOpportunity.description.substring(0, this.opportunityDescriptionLength)
      : volunteerOpportunity.description;
  }

  toggleOpportunityDescription(volunteerOpportunity: VolunteerOpportunity) {
    volunteerOpportunity.collapseDescription = !volunteerOpportunity.collapseDescription;
  }

  loadMoreOpportunities() {
    this.pageNumber += 1;

    this.loadOpportunities();
  }

  registerToOpportunity(volunteerOpportunity: VolunteerOpportunity) {
    this.volunteerOpportunityService.registerCurrentUserToOpportunity(volunteerOpportunity)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Interesse cadastrado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
            this.toastService.show('Pendente de aprovação', { classname: 'bg-info text-light', delay: 5000 });
          }
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);

          if (httpErrorResponse.status == HttpStatusCode.Conflict) {
            this.toastService.show('Cadastro já realizado', { classname: 'bg-info text-light', delay: 5000 });

            return;
          }

          if (httpErrorResponse?.error) {
            this.toastService.show('Houve um erro ao registrar o interesse', { classname: 'bg-danger text-light', delay: 5000 });
            this.toastService.show('Será necessário tentar novamente', { classname: 'bg-danger text-light', delay: 5000 });
          }
        }
      });
  }

  convertBase64ToPhotoUrl(photoBase64: string) {
    const photoExtension = this.fileService.fileExtension(photoBase64);
    return `data:image/${photoExtension};base64,${photoBase64}`;
  }

  private loadOpportunities() {
    this.volunteerOpportunityService.search({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    })
      .subscribe({
        next: (page: Page<VolunteerOpportunity[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.volunteerOpportunities.length == 0) {
              this.volunteerOpportunities = page.data;
            } else {
              this.volunteerOpportunities.push(...page.data);
            }

            for (const volunteerOpportunity of this.volunteerOpportunities) {
              volunteerOpportunity.collapseDescription =
                volunteerOpportunity.description.length > this.opportunityDescriptionLength;
            }
          }
        }
      });
  }

}
