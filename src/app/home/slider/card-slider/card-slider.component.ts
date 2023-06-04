import { Component, Input, inject } from '@angular/core';
import Swiper, { Navigation, Pagination } from 'swiper';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//Interfaces
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
//Services
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { FileService } from 'src/shared/services/file.service';


@Component({
  selector: 'app-card-slider',
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.css']
})

export class CardSliderComponent {

  @Input() volunteerOpportunities: VolunteerOpportunity[] = [];

  closeResult = '';

  name = 'Angular';

   constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
    private modalService: NgbModal,
    private fileService: FileService
    ) {  }

  openXl(content) {
		this.modalService.open(content, { size: 'xl' });
	}

	openModal(content, data) {
		const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' })
    modalRef.componentInstance.volunteerOpportunity = data;
  }

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
}
