import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  //ADM
  //CANDIDATE
  //INSTITUTION
  //UNKNOW
  userMenuType: string = 'UNKNOW';

  constructor(
    private router: Router,
    private accessService: AccessService,
  ) {
    this.loginSubscription = accessService.loginNotification()
      .subscribe(loggedIn => {
        if (loggedIn) {
          this.configureMenuForCurrentUser();
        } else {
          this.userMenuType = 'UNKNOW';
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

  async sair() {
    this.accessService.logout();

    this.userMenuType = 'UNKNOW';

    await this.router.navigateByUrl('/');
  }

  private configureMenuForCurrentUser() {
    const currentUser = this.accessService.getCurrentUser();

    if (currentUser == null) {
      this.userMenuType = 'UNKNOW';
    } else {
      this.userMenuType = currentUser.role;
    }

    // TODO adicionar a checagem para o acesso adm
  }
}
