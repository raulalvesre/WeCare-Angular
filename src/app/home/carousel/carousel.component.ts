import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  slides = [
    { 
      title: 'Slide 1', 
      text: 'This is the first slide', 
      image: '../../../assets/img/c-1.jpg' 
    },
    { 
      title: 'Slide 2', 
      text: 'This is the second slide', 
      image: '../../../assets/img/c-2.jpg' 
    },
    { 
      title: 'Slide 3', 
      text: 'This is the third slide', 
      image: '../../../assets/img/c-3.jpg' 
    },
    { 
      title: 'Slide 4', 
      text: 'This is the fourth slide', 
      image: '../../../assets/img/c-4.jpg' 
    }
  ];
}

