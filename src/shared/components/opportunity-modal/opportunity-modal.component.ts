import {NgIf, NgTemplateOutlet, NgFor, DatePipe} from '@angular/common';
import {Component, Input, TemplateRef} from '@angular/core';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from 'src/shared/services/toast.service';
import {VolunteerOpportunity} from "../../models/volunteer-opportunity.model";
import {FileService} from "../../services/file.service";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {VolunteerOpportunityService} from "../../services/volunteer-opportunity.service";

@Component({
  selector: 'app-opportunity-modal',
  standalone: true,
  templateUrl: './opportunity-modal.component.html',
  styleUrls: ['./opportunity-modal.component.css'],
  imports: [NgbToastModule, NgIf, NgTemplateOutlet, NgFor, DatePipe],
})
export class OpportunityModalComponent {
  @Input() volunteerOpportunity: VolunteerOpportunity;
  @Input() shouldShowRegisterBtns: boolean;
  @Input() userRole: string;
  @Input() modal: any;

  constructor(private fileService: FileService, private toastService: ToastService, private volunteerOpportunityService: VolunteerOpportunityService) {
  }

  convertBase64ToPhotoUrl(photoBase64: string) {
    const photoExtension = this.fileService.fileExtension(photoBase64);
    return `data:image/${photoExtension};base64,${photoBase64}`;
  }

  registerToOpportunity(event: any, volunteerOpportunity: VolunteerOpportunity) {
    this.volunteerOpportunityService.registerCurrentUserToOpportunity(volunteerOpportunity)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Interesse cadastrado com sucesso', {
              classname: 'bg-success text-light',
              delay: 5000
            });
            this.toastService.show('Pendente de aprovação', {classname: 'bg-info text-light', delay: 5000});
            volunteerOpportunity.isCandidateRegistered = true;
          }
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);

          if (httpErrorResponse.status == HttpStatusCode.Conflict) {
            if (httpErrorResponse.error.message?.toUpperCase()?.includes('OPORTUNIDADE JÁ ACONTECEU')) {
              this.toastService.show('Oportunidade já aconteceu', {classname: 'bg-info text-light', delay: 5000});
            } else {
              this.toastService.show('Cadastro já realizado', {classname: 'bg-info text-light', delay: 5000});
            }

            return;
          }

          if (httpErrorResponse?.error) {
            this.toastService.show('Houve um erro ao registrar o interesse', {
              classname: 'bg-danger text-light',
              delay: 5000
            });
            this.toastService.show('Será necessário tentar novamente', {
              classname: 'bg-danger text-light',
              delay: 5000
            });
          }
        }
      });
  }

}
