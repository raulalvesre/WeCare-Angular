import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { FederativeUnit } from 'src/shared/models/address.model';
import { Institution } from 'src/shared/models/institution.model';
import { OpportunityCause } from 'src/shared/models/opportunity-cause.model';
import { Page } from 'src/shared/models/page.model';
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
import { AccessService } from 'src/shared/services/access.service';
import { FileService } from 'src/shared/services/file.service';
import { OpportunityCauseService } from 'src/shared/services/opportunity-cause.service';
import { ToastService } from 'src/shared/services/toast.service';
import { ViaCepService } from 'src/shared/services/via-cep.service';
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';

@Component({
  selector: 'app-opportunities-search-admin',
  templateUrl: './opportunities-search-admin.component.html',
  styleUrls: ['./opportunities-search-admin.component.css']
})
export class OpportunitiesSearchAdminComponent {
  readonly opportunityDescriptionLength = 50;

  searchForm: FormGroup;

  volunteerOpportunities: VolunteerOpportunity[] = [];

  opportunityCauses: OpportunityCause[] = [];
  selectedOpportunityCauses: OpportunityCause[] = [];

  federativeUnits: FederativeUnit[] = [];
  selectedFederativeUnits: FederativeUnit[] = [];

  initialDate?: Date
  finalDate?: Date

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;

  searching = true;

  constructor(
    private accessService: AccessService,
    private volunteerOpportunityService: VolunteerOpportunityService,
    private opportunityCauseService: OpportunityCauseService,
    private toastService: ToastService,
    private fileService: FileService,
    private viaCepService: ViaCepService
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      initialDate: new FormControl(),
      finalDate: new FormControl(),
    });

    this.searchOpportunities();

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
          this.searchOpportunities();
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
          this.searchOpportunities();
        }, 1500);
      });
  }

  addCauseToSearch(opportunityCause: OpportunityCause) {
    const opportunityIndex = this.selectedOpportunityCauses.indexOf(opportunityCause);
    if (opportunityIndex >= 0) {
      return;
    }

    this.selectedOpportunityCauses.push(opportunityCause);

    this.searchOpportunities();
  }

  removeOpportunityCause(opportunityCause) {
    const opportunityIndex = this.selectedOpportunityCauses.indexOf(opportunityCause);
    this.selectedOpportunityCauses.splice(opportunityIndex, 1);

    this.searchOpportunities();
  }

  addFederativeUnitToSearch(federativeUnit: FederativeUnit) {
    // const federativeUnitIndex = this.selectedFederativeUnits.indexOf(federativeUnit);
    // if (federativeUnitIndex >= 0) {
    //   return;
    // }

    // this.selectedFederativeUnits.push(federativeUnit);


    this.selectedFederativeUnits = [federativeUnit];

    this.searchOpportunities();
  }

  removeFederativeUnit(federativeUnit: FederativeUnit) {
    const federativeUnitIndex = this.selectedFederativeUnits.indexOf(federativeUnit);
    this.selectedFederativeUnits.splice(federativeUnitIndex, 1);

    this.searchOpportunities();
  }

  clearDatesSelection() {
    this.searchForm.get('initialDate')
      .setValue(null, { onlySelf: true, emitEvent: false });
    this.searchForm.get('finalDate')
      .setValue(null, { onlySelf: true, emitEvent: false });

    this.initialDate = null;
    this.finalDate = null;

    this.searchOpportunities();
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

    this.searchOpportunities();
  }

  registerToOpportunity(volunteerOpportunity: VolunteerOpportunity) {
    this.volunteerOpportunityService.registerCurrentUserToOpportunity(volunteerOpportunity)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Interesse cadastrado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
            this.toastService.show('Pendente de aprovação', { classname: 'bg-info text-light', delay: 5000 });
          }
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);

          if (httpErrorResponse.status == HttpStatusCode.Conflict) {
            this.toastService.show('Cadastro já realizado', { classname: 'bg-info text-light', delay: 5000 });

            return;
          }

          if (httpErrorResponse?.error) {
            this.toastService.show('Houve um erro ao registrar o interesse', { classname: 'bg-danger text-light', delay: 5000 });
            this.toastService.show('Será necessário tentar novamente', { classname: 'bg-danger text-light', delay: 5000 });
          }
        }
      });
  }

  convertBase64ToPhotoUrl(photoBase64: string) {
    const photoExtension = this.fileService.fileExtension(photoBase64);
    return `data:image/${photoExtension};base64,${photoBase64}`;
  }

  deleteOpportunity(volunteerOpportunity: VolunteerOpportunity) {
    this.volunteerOpportunityService.deleteOpportunity(volunteerOpportunity)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Oportunidade deletada com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          }

          this.searchOpportunities();
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
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

  private searchOpportunities() {
    this.searching = true;

    this.pageNumber = 1;
    this.volunteerOpportunities = [];

    const loggedInstitution = this.accessService.getCurrentUser() as Institution;

    this.volunteerOpportunityService.search({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      institutionId: loggedInstitution.id,
      opportunityCauses: this.selectedOpportunityCauses,
      federativeUnits: this.selectedFederativeUnits,
      initialDate: this.initialDate,
      finalDate: this.finalDate
    })
      .pipe(delay(700))
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
}
