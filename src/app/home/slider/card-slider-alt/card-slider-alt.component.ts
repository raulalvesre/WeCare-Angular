import { Component, Input, inject } from '@angular/core';
import Swiper, { Navigation, Pagination } from 'swiper';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//Interfaces
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
//Services
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { FileService } from 'src/shared/services/file.service';


@Component({
  selector: 'app-card-slider-alt',
  templateUrl: './card-slider-alt.component.html',
  styleUrls: ['./card-slider-alt.component.css']
})

export class CardSliderAltComponent {

  @Input() volunteerOpportunities: VolunteerOpportunity[] = [];

  name = 'Angular';

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
    private modalService: NgbModal,
    private fileService: FileService
  ) { }

  openXl(content) {
		this.modalService.open(content, { size: 'xl', centered: true });
	}

  convertBase64ToPhotoUrl(photoBase64: string) {
    const photoExtension = this.fileService.fileExtension(photoBase64);
    return `data:image/${photoExtension};base64,${photoBase64}`;
  }

  ngAfterViewInit() {
    let swiperB = new Swiper('#swiperB', {
      // autoplay: {delay: 5000},
      slidesPerView: 1,
      spaceBetween: 25,
      pagination: {
        el: "#swiper-paginationB",
        clickable: true,
        dynamicBullets: true,

      },
      navigation: {
        nextEl: "#swiper-button-nextB",
        prevEl: "#swiper-button-prevB",
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
