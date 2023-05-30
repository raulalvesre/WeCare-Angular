import { Component, inject } from '@angular/core';
import Swiper, { Navigation, Pagination } from 'swiper';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//Interfaces
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
//Services
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';

@Component({
  selector: 'app-card-slider',
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.css']
})

export class CardSliderComponent {

  volunteerOpportunities: VolunteerOpportunity[] = [];
  volunteerOpportunityService: VolunteerOpportunityService = inject(VolunteerOpportunityService);
  
  closeResult = '';

  name = 'Angular';

   constructor(private modalService: NgbModal) {
    this.volunteerOpportunities = this.volunteerOpportunityService.getLastAddedvolunteerOpportunities(); 

  }

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

  ngAfterViewInit() {
    let swiperA = new Swiper('#swiperA', {
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