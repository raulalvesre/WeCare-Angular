import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccessService } from 'src/shared/services/access.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription;

  isMenuCollapsed = true;
  // mock pra nav bar
  //opções:
  //adm
  //volunteer
  //institution
  //unknow
  userMenuType: string = 'unknow';

  constructor(private accessService: AccessService) {
    this.loginSubscription = accessService.loginNotification()
      .subscribe(loggedIn => {
        if (loggedIn) {
          this.configureMenuForCurrentUser();
        } else {
          this.userMenuType = 'unknow';
        }
      });
  }

  ngOnInit(): void {
    this.configureMenuForCurrentUser();
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  toggleNavigationMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeNavigationMenu() {
    this.isMenuCollapsed = true;
  }

  private configureMenuForCurrentUser() {
    const currentUser = this.accessService.getCurrentUser();

    if (currentUser == null) {
      this.userMenuType = 'unknow';
    } else if ('cnpj' in currentUser) {
      this.userMenuType = 'institution';
    } else {
      this.userMenuType = 'volunteer';
    }

    // TODO adicionar a checagem para o acesso adm
  }
}
