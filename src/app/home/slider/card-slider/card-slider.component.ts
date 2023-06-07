import { Component, Input, inject } from '@angular/core';
import Swiper, { Navigation, Pagination } from 'swiper';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//Interfaces
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
//Services
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { FileService } from 'src/shared/services/file.service';
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {ToastService} from "../../../../shared/services/toast.service";


@Component({
  selector: 'app-card-slider',
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.css']
})

export class CardSliderComponent {

  @Input() volunteerOpportunities: VolunteerOpportunity[] = [];
  @Input() userRole: string;

  closeResult = '';

  name = 'Angular';

   constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
    private modalService: NgbModal,
    private fileService: FileService,
    private toastService: ToastService
    ) {  }

  openXl(content) {
		this.modalService.open(content, { size: 'xl', centered: true });
	}

	// openModal(content, data) {
	// 	const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' })
  //   modalRef.componentInstance.volunteerOpportunity = data;
  // }

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  convertBase64ToPhotoUrl(photoBase64: string) {
    const photoExtension = this.fileService.fileExtension(photoBase64);
    return `data:image/${photoExtension};base64,${photoBase64}`;
  }

  ngAfterViewInit() {
    let swiperA = new Swiper('#swiperA', {
      modules: [Navigation, Pagination],
      // autoplay: {delay: 5000},
      slidesPerView: 1,
      spaceBetween: 25,
      pagination: {
        el: "#swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: "#swiper-button-next",
        prevEl: "#swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        750: {
          slidesPerView: 2,
        },
        1050: {
          slidesPerView: 3,
        },
        1250: {
          slidesPerView: 4,
        },
      },
    })
  }

  registerToOpportunity(event: any, volunteerOpportunity: VolunteerOpportunity) {
    this.volunteerOpportunityService.registerCurrentUserToOpportunity(volunteerOpportunity)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Interesse cadastrado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
            this.toastService.show('Pendente de aprovação', { classname: 'bg-info text-light', delay: 5000 });
            volunteerOpportunity.isCandidateRegistered = true;
          }
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);

          if (httpErrorResponse.status == HttpStatusCode.Conflict) {
            if (httpErrorResponse.error.message?.toUpperCase()?.includes('OPORTUNIDADE JÁ ACONTECEU')) {
              this.toastService.show('Oportunidade já aconteceu', { classname: 'bg-info text-light', delay: 5000 });
            } else {
              this.toastService.show('Cadastro já realizado', { classname: 'bg-info text-light', delay: 5000 });
            }

            return;
          }

          if (httpErrorResponse?.error) {
            this.toastService.show('Houve um erro ao registrar o interesse', { classname: 'bg-danger text-light', delay: 5000 });
            this.toastService.show('Será necessário tentar novamente', { classname: 'bg-danger text-light', delay: 5000 });
          }
        }
      });
  }
}
