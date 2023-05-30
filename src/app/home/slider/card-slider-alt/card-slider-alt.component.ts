import { Component, inject } from '@angular/core';
import Swiper, { Navigation, Pagination } from 'swiper';
//Interfaces
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
//Services
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';

@Component({
  selector: 'app-card-slider-alt',
  templateUrl: './card-slider-alt.component.html',
  styleUrls: ['./card-slider-alt.component.css']
})

export class CardSliderAltComponent {

  volunteerOpportunities: VolunteerOpportunity[] = [];
  volunteerOpportunityService: VolunteerOpportunityService = inject(VolunteerOpportunityService);

  name = 'Angular';

  constructor() {  
    this.volunteerOpportunities = this.volunteerOpportunityService.getLastAddedvolunteerOpportunities(); 
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
