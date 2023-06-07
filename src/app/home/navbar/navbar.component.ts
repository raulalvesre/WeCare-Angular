import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Candidate } from 'src/shared/models/candidate.model';
import { Institution } from 'src/shared/models/institution.model';
import { AccessService } from 'src/shared/services/access.service';
import { CandidateService } from 'src/shared/services/candidate.service';
import { ImageService } from 'src/shared/services/image.service';
import { InstitutionService } from 'src/shared/services/institution.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription;

  currentCandidate: Candidate;
  currentInstitution: Institution;

  isMenuCollapsed = true;
  // mock pra nav bar
  //opções:
  //ADM
  //CANDIDATE
  //INSTITUTION
  //UNKNOW
  userMenuType: string = 'INSTITUTION';

  constructor(
    private router: Router,
    private accessService: AccessService,
    private candidateService: CandidateService,
    private institutionService: InstitutionService,
    public imageService: ImageService
  ) {
    this.loginSubscription = accessService.loginNotification()
      .subscribe(loggedIn => {
        if (loggedIn) {
          this.configureMenuForCurrentUser();
        } else {
          this.userMenuType = 'INSTITUTION';
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

      if (this.userMenuType == 'CANDIDATE') {
        this.searchCandidate();
      } else if (this.userMenuType == 'INSTITUTION') {
        this.searchInstitution();
      }
    }

    // TODO adicionar a checagem para o acesso adm
  }

  private searchCandidate() {
    const currentUser = this.accessService.getCurrentUser();

    this.candidateService.searchCandidate(currentUser.id)
      .subscribe({
        next: candidate => {
          this.currentCandidate = candidate;
        }
      });
  }

  private searchInstitution() {
    const currentUser = this.accessService.getCurrentUser();

    this.institutionService.get(currentUser.id)
      .subscribe({
        next: institution => {
          this.currentInstitution = institution;
        }
      });
  }
}
