import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuCollapsed = true;

  toggleNavigationMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeNavigationMenu() {
    this.isMenuCollapsed = true;
  }
}
