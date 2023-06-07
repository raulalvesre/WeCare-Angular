import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, distinctUntilChanged } from 'rxjs';
import { OpportunityCause } from 'src/shared/models/opportunity-cause.model';
import { OpportunityRegistration } from 'src/shared/models/opportunity-registration.model';
import { OpportunityCauseService } from 'src/shared/services/opportunity-cause.service';
import { ToastService } from 'src/shared/services/toast.service';
import { ViaCepService } from 'src/shared/services/via-cep.service';
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-opportunity-create',
  templateUrl: './opportunity-create.component.html',
  styleUrls: ['./opportunity-create.component.css']
})
export class OpportunityCreateComponent implements OnInit, OnDestroy {

  form: FormGroup;

  postalCodeInvalid = false;

  opportunityCauses: OpportunityCause[] = [];
  selectedOpportunityCauses: OpportunityCause[] = [];

  showPhotoPreview = false;
  photoPreviewUrl = '';

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
    private opportunityCauseService: OpportunityCauseService,
    private toastService: ToastService,
    private viaCepService: ViaCepService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(500)]),
      opportunityDate: new FormControl(null, [Validators.required]),
      photo: new FormControl(null, [Validators.required]),
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

    this.form.get('photo')
      .valueChanges
      .subscribe(file => {
        const photoFile = (document.querySelector('#photo') as HTMLInputElement).files[0];

        this.showPhotoPreview = true;
        const fileReader = new FileReader();
        fileReader.readAsDataURL(photoFile);
        fileReader.onload = () => {
          this.photoPreviewUrl = fileReader.result as string;
        }
      });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
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

  register() {
    const {
      name,
      description,
      opportunityDate,
      photo,
      address,
    } = this.form.value;

    const opportunityRegistration: OpportunityRegistration = {
      name: name.trim(),
      description: description.trim(),
      opportunityDate: new Date(opportunityDate),
      photo,
      address,
      opportunityCauses: this.selectedOpportunityCauses
    };

    opportunityRegistration.photo = (document.querySelector('#photo') as HTMLInputElement)?.files[0] ?? null;

    this.volunteerOpportunityService.registerOpportunity(opportunityRegistration)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.Ok) {
            this.toastService.show('Cadastro realizado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
            this.router.navigateByUrl('opportunities-institution');
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
