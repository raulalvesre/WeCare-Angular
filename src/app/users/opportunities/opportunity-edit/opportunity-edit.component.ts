import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, delay, distinctUntilChanged } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Institution } from 'src/shared/models/institution.model';
import { OpportunityCause } from 'src/shared/models/opportunity-cause.model';
import { OpportunityRegistration } from 'src/shared/models/opportunity-registration.model';
import { FileService } from 'src/shared/services/file.service';
import { OpportunityCauseService } from 'src/shared/services/opportunity-cause.service';
import { ToastService } from 'src/shared/services/toast.service';
import { ViaCepService } from 'src/shared/services/via-cep.service';
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';

@Component({
  selector: 'app-opportunity-edit',
  templateUrl: './opportunity-edit.component.html',
  styleUrls: ['./opportunity-edit.component.css']
})
export class OpportunityEditComponent implements OnInit, OnDestroy {

  form: FormGroup;

  opportunityId: number;

  loggedInstitution: Institution;
  volunteerOpportunityId: number;

  postalCodeInvalid = false;

  opportunityCauses: OpportunityCause[] = [];
  selectedOpportunityCauses: OpportunityCause[] = [];

  showPhotoPreview = false;
  photoPreviewUrl = '';

  private routeSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private volunteerOpportunityService: VolunteerOpportunityService,
    private toastService: ToastService,
    private viaCepService: ViaCepService,
    private opportunityCauseService: OpportunityCauseService,
    private fileService: FileService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(500)]),
      opportunityDate: new FormControl(null, [Validators.required]),
      photo: new FormControl(null),
      address: new FormGroup({
        street: new FormControl(null, [Validators.required]),
        number: new FormControl(null, [Validators.min(1), Validators.max(Number.MAX_SAFE_INTEGER)]),
        complement: new FormControl(null),
        city: new FormControl(null, [Validators.required]),
        neighborhood: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        postalCode: new FormControl(null, [Validators.required, Validators.pattern(/^\d{5}\-\d{3}$/)]),
      }),
      causes: new FormControl([])
    });

    this.activatedRoute.params.subscribe(parameters => {
      this.volunteerOpportunityId = parameters.id;

      this.searchOpportunity();
    });

    this.opportunityCauseService.search()
      .subscribe({
        next: opportunityCauses => {
          this.opportunityCauses = opportunityCauses;
        },
        error: error => {
          console.error(error);
        }
      });

    this.form.get('address').get('postalCode')
      .valueChanges
      .pipe(distinctUntilChanged(), delay(200))
      .subscribe((postalCode: string) => {
        const postalCodePattern = /^\d{5}\-\d{3}$/;
        if (postalCodePattern.test(postalCode)) {
          this.searchPostalCode(postalCode);
        }
      });

    this.routeSubscription = this.route.params
      .subscribe(params => {
        this.opportunityId = params['id'];
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  searchOpportunity() {
    this.volunteerOpportunityService
      .searchById({ volunteerOpportunityId: this.volunteerOpportunityId })
      .subscribe({
        next: volunteerOpportunity => {
          this.form.get('name').setValue(volunteerOpportunity.name);
          this.form.get('description').setValue(volunteerOpportunity.description);

          this.form.get('opportunityDate').setValue(formatDate(volunteerOpportunity.opportunityDate, 'yyyy-MM-dd', 'en'));

          // this.form.get('photo').setValue(volunteerOpportunity.photo);
          this.form.get('address').get('street').setValue(volunteerOpportunity.address.street);
          this.form.get('address').get('number').setValue(volunteerOpportunity.address.number);
          this.form.get('address').get('complement').setValue(volunteerOpportunity.address.complement);
          this.form.get('address').get('city').setValue(volunteerOpportunity.address.city);
          this.form.get('address').get('neighborhood').setValue(volunteerOpportunity.address.neighborhood);
          this.form.get('address').get('state').setValue(volunteerOpportunity.address.state);
          this.form.get('address').get('postalCode').setValue(volunteerOpportunity.address.postalCode);
          this.form.get('causes').setValue(volunteerOpportunity.causes);

          const photoExtension = this.fileService.fileExtension(volunteerOpportunity.photo);

          const photoUrl = `data:image/${photoExtension};base64,${volunteerOpportunity.photo}`;

          const photoDataTransfer = new DataTransfer();
          this.fileService
            .urlToFile(photoUrl, `${uuidv4()}.jpg`)
            .then(photoFile => {
              const imageExtensionType = photoFile.type;

              photoDataTransfer.items.add(photoFile);

              (document.querySelector('#photo') as HTMLInputElement).files = photoDataTransfer.files;

              this.showPhotoPreview = true;
              this.photoPreviewUrl = `data:${imageExtensionType};base64,${volunteerOpportunity.photo}`;
            });


          this.selectedOpportunityCauses = [
            ...this.opportunityCauses.filter(
              opportunityCause => volunteerOpportunity.causes.includes(opportunityCause.name)
            )
          ];
        }
      });
  }

  addCause(opportunityCause: string) {
    const selectedCause = this.opportunityCauses.find(cause => cause.code === opportunityCause);

    const opportunityCauseAlreadyAdded = this.selectedOpportunityCauses.find(cause => cause.code === selectedCause.code)
    if (!opportunityCauseAlreadyAdded) {
      this.selectedOpportunityCauses.push(selectedCause);
    }
  }

  removeCause(opportunityCause: OpportunityCause) {
    const opportunityIndex = this.selectedOpportunityCauses.indexOf(opportunityCause);
    this.selectedOpportunityCauses.splice(opportunityIndex, 1);
  }

  save() {
    const {
      name,
      description,
      opportunityDate,
      photo,
      address,
    } = this.form.value;

    const opportunityRegistration: OpportunityRegistration = {
      id: this.opportunityId,
      name: name.trim(),
      description: description.trim(),
      opportunityDate: new Date(opportunityDate),
      photo,
      address,
      opportunityCauses: this.selectedOpportunityCauses
    };

    opportunityRegistration.photo = (document.querySelector('#photo') as HTMLInputElement)?.files[0] ?? null;

    this.volunteerOpportunityService.updateOpportunity(opportunityRegistration)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.Ok) {
            this.toastService.show('Cadastro realizado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          }
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      });
  }

  private searchPostalCode(postalCode: string) {
    this.postalCodeInvalid = false;

    this.viaCepService.consultarCep(postalCode)
      .subscribe({
        next: (postalAddress) => {
          if ('erro' in postalAddress) {
            this.postalCodeInvalid = true;
          } else {
            this.form.get('address').get('street').setValue(postalAddress.logradouro);
            this.form.get('address').get('complement').setValue(postalAddress.complemento);
            this.form.get('address').get('city').setValue(postalAddress.localidade);
            this.form.get('address').get('neighborhood').setValue(postalAddress.bairro);
            this.form.get('address').get('state').setValue(postalAddress.uf);

            this.postalCodeInvalid = false;
          }
        }, error: (error) => {
          console.error(error);
        }
      });
  }
}
