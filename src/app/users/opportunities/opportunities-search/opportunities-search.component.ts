import { Component, OnInit } from '@angular/core';
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { Page } from 'src/shared/models/page.model';
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
import { ToastService } from 'src/shared/services/toast.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { FederativeUnit } from 'src/shared/models/address.model';
import { OpportunityCause } from 'src/shared/models/opportunity-cause.model';
import { delay } from 'rxjs';
import { ViaCepService } from 'src/shared/services/via-cep.service';
import { OpportunityCauseService } from 'src/shared/services/opportunity-cause.service';
import { AccessService } from 'src/shared/services/access.service';
import { ImageService } from 'src/shared/services/image.service';


@Component({
  selector: 'app-opportunities-search',
  templateUrl: './opportunities-search.component.html',
  styleUrls: ['./opportunities-search.component.css']
})
export class OpportunitiesSearchComponent implements OnInit {
  readonly opportunityDescriptionLength = 50;

  searchForm: FormGroup;

  volunteerOpportunities: VolunteerOpportunity[] = [];

  opportunityCauses: OpportunityCause[] = [];
  selectedOpportunityCauses: OpportunityCause[] = [];

  federativeUnits: FederativeUnit[] = [];
  selectedFederativeUnits: FederativeUnit[] = [];

  initialDate?: Date;
  finalDate?: Date;

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;

  searching = true;

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private viaCepService: ViaCepService,
    private opportunityCauseService: OpportunityCauseService,
    private accessService: AccessService,
    public imageService: ImageService,
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      initialDate: new FormControl(),
      finalDate: new FormControl(),
    });

    this.loadOpportunities();

    this.searchCauses();

    this.searchFederativeUnits();

    this.searchForm.get('initialDate')
      .valueChanges
      .pipe(delay(200))
      .subscribe(initialDate => {
        if (new Date(initialDate) instanceof Date) {
          this.initialDate = new Date(initialDate);
        }

        setTimeout(() => {
          this.loadOpportunities();
        }, 1500);
      });

    this.searchForm.get('finalDate')
      .valueChanges
      .pipe(delay(200))
      .subscribe(finalDate => {
        if (new Date(finalDate) instanceof Date) {
          this.finalDate = new Date(finalDate);
        }

        setTimeout(() => {
          this.loadOpportunities();
        }, 1500);
      });
  }

  addCauseToSearch(opportunityCause: OpportunityCause) {
    const opportunityIndex = this.selectedOpportunityCauses.indexOf(opportunityCause);
    if (opportunityIndex >= 0) {
      return;
    }

    this.selectedOpportunityCauses.push(opportunityCause);

    this.loadOpportunities();
  }

  removeOpportunityCause(opportunityCause) {
    const opportunityIndex = this.selectedOpportunityCauses.indexOf(opportunityCause);
    this.selectedOpportunityCauses.splice(opportunityIndex, 1);

    this.loadOpportunities();
  }

  addFederativeUnitToSearch(federativeUnit: FederativeUnit) {
    // const federativeUnitIndex = this.selectedFederativeUnits.indexOf(federativeUnit);
    // if (federativeUnitIndex >= 0) {
    //   return;
    // }

    // this.selectedFederativeUnits.push(federativeUnit);


    this.selectedFederativeUnits = [federativeUnit];

    this.loadOpportunities();
  }

  removeFederativeUnit(federativeUnit: FederativeUnit) {
    const federativeUnitIndex = this.selectedFederativeUnits.indexOf(federativeUnit);
    this.selectedFederativeUnits.splice(federativeUnitIndex, 1);

    this.loadOpportunities();
  }

  clearDatesSelection() {
    this.searchForm.get('initialDate')
      .setValue(null, { onlySelf: true, emitEvent: false });
    this.searchForm.get('finalDate')
      .setValue(null, { onlySelf: true, emitEvent: false });

    this.initialDate = null;
    this.finalDate = null;

    this.loadOpportunities();
  }

  getOpportunityDescription(volunteerOpportunity: VolunteerOpportunity): string {
    return volunteerOpportunity.collapseDescription
      ? volunteerOpportunity.description.substring(0, this.opportunityDescriptionLength)
      : volunteerOpportunity.description;
  }

  toggleOpportunityDescription(volunteerOpportunity: VolunteerOpportunity) {
    volunteerOpportunity.collapseDescription = !volunteerOpportunity.collapseDescription;
  }

  loadMoreOpportunities() {
    this.pageNumber += 1;

    this.loadOpportunities();
  }

  registerToOpportunity(volunteerOpportunity: VolunteerOpportunity) {
    this.volunteerOpportunityService.registerCurrentUserToOpportunity(volunteerOpportunity)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Interesse cadastrado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
            this.toastService.show('Pendente de aprovação', { classname: 'bg-info text-light', delay: 5000 });

            this.loadOpportunities();
          }
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);

          if (httpErrorResponse.status == HttpStatusCode.Conflict) {
            if (httpErrorResponse.error.message?.toUpperCase()?.includes('OPORTUNIDADE JÁ ACONTECEU')) {
              this.toastService.show('Oportunidade já aconteceu', { classname: 'bg-info text-light', delay: 5000 });
            } else {
              this.toastService.show('Cadastro já realizado', { classname: 'bg-info text-light', delay: 5000 });
            }

            return;
          }

          if (httpErrorResponse?.error) {
            this.toastService.show('Houve um erro ao registrar o interesse', { classname: 'bg-danger text-light', delay: 5000 });
            this.toastService.show('Será necessário tentar novamente', { classname: 'bg-danger text-light', delay: 5000 });
          }
        }
      });
  }

  openVolunteerOpportunityModal(volunteerOpportunityModal) {
    this.modalService.open(volunteerOpportunityModal, { size: 'xl', centered: true });
  }

  private loadOpportunities() {
    const currentUser = this.accessService.getCurrentUser();

    this.searching = true;

    this.pageNumber = 1;
    this.volunteerOpportunities = [];

    this.volunteerOpportunityService.search({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      candidateNotRegistered: currentUser.id,
      opportunityCauses: this.selectedOpportunityCauses,
      federativeUnits: this.selectedFederativeUnits,
      initialDate: this.initialDate,
      finalDate: this.finalDate
    })
      .subscribe({
        next: (page: Page<VolunteerOpportunity[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.volunteerOpportunities.length == 0) {
              this.volunteerOpportunities = page.data;
            } else {
              this.volunteerOpportunities.push(...page.data);
            }

            for (const volunteerOpportunity of this.volunteerOpportunities) {
              volunteerOpportunity.collapseDescription =
                volunteerOpportunity.description.length > this.opportunityDescriptionLength;
            }
          }
        }
      })
      .add(() => {
        this.searching = false;
      });
  }

  private searchCauses() {
    this.opportunityCauseService.search()
      .subscribe({
        next: opportunityCauses => {
          this.opportunityCauses = opportunityCauses;
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private searchFederativeUnits() {
    this.viaCepService.getFederativeUnits()
      .subscribe(federativeUnits => {
        this.federativeUnits = federativeUnits;
      });
  }

}
