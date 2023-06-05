import { Component } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-card-slider-photos',
  templateUrl: './card-slider-photos.component.html',
  styleUrls: ['./card-slider-photos.component.css']
})

export class CardSliderPhotosComponent {
  name = 'Angular';
  images = ['../../../assets/img/c-01.png', '../../../assets/img/c-02.png', '../../../assets/img/c-03.png'];

  constructor() {}

  ngAfterViewInit() {
    new Swiper('.slide-content-alt', {
    // autoplay: {delay: 5000},
    slidesPerView: 3,
    spaceBetween: 500,
    loop: true,
    centeredSlides: true,
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: ".swiper-pagination-alt",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next-alt",
      prevEl: ".swiper-button-prev-alt",
    },
      breakpoints:{
          0: {
              slidesPerView: 1,
          },
          520: {
              slidesPerView: 2,
          },
          950: {
              slidesPerView: 3,
          },
          1250: {
            slidesPerView: 4,
        },
      },
    });
  }
}
