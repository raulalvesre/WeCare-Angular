import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, delay } from 'rxjs';
import { UserDocumentType } from 'src/shared/models/document-type.model';
import { Institution } from 'src/shared/models/institution.model';
import { AccessService } from 'src/shared/services/access.service';
import { InstitutionService } from 'src/shared/services/institution.service';
import { ToastService } from 'src/shared/services/toast.service';
import { ViaCepService } from 'src/shared/services/via-cep.service';

@Component({
  selector: 'app-institution-profile',
  templateUrl: './institution-profile.component.html',
  styleUrls: ['./institution-profile.component.css']
})
export class InstitutionProfileComponent {
  readonly cnpj = UserDocumentType.cnpj;

  institution: Institution;

  form: FormGroup;

  postalCodeInvalid = false;

  constructor(
    private institutionService: InstitutionService,
    private accessService: AccessService,
    private toastService: ToastService,
    private viaCepService: ViaCepService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      telephone: new FormControl(null, [Validators.required, Validators.minLength(14)]),
      biography: new FormControl(null, [Validators.required, Validators.minLength(12)]),
      cnpj: new FormControl(null, [Validators.required, Validators.minLength(14), Validators.maxLength(18)]),
      documentType: new FormControl(this.cnpj),
      address: new FormGroup({
        street: new FormControl(null, [Validators.required]),
        number: new FormControl(null, [Validators.min(1), Validators.max(Number.MAX_SAFE_INTEGER)]),
        complement: new FormControl(null),
        city: new FormControl(null, [Validators.required]),
        neighborhood: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        postalCode: new FormControl(null, [Validators.required, Validators.pattern(/^\d{5}\-\d{3}$/)]),
      })
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

    this.searchInstitution();
  }

  private searchInstitution() {
    const user = this.accessService.getCurrentUser();

    this.institutionService.get(user.id)
      .subscribe(institution => {
        this.institution = institution;

        this.form.get('email').setValue(institution.email);
        this.form.get('name').setValue(institution.name);
        this.form.get('telephone').setValue(institution.telephone);
        this.form.get('biography').setValue(institution.bio);
        this.form.get('cnpj').setValue(institution.cnpj);
        this.form.get('address').get('street').setValue(institution.address.street);
        this.form.get('address').get('number').setValue(institution.address.number);
        this.form.get('address').get('complement').setValue(institution.address.complement);
        this.form.get('address').get('city').setValue(institution.address.city);
        this.form.get('address').get('neighborhood').setValue(institution.address.neighborhood);
        this.form.get('address').get('state').setValue(institution.address.state);
        this.form.get('address').get('postalCode').setValue(institution.address.postalCode);
      });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  save() {
    const {
      email,
      name,
      telephone,
      biography,
      cnpj,
      address
    } = this.form.value;

    const user = this.accessService.getCurrentUser();

    const institution: Institution = {
      id: user.id,
      email,
      name,
      telephone,
      cnpj,
      bio: biography,
      address: {
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        neighborhood: address.neighborhood,
        state: address.state,
        postalCode: address.postalCode
      }
    };

    this.institutionService.updateInstitution(institution)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Atualição feita com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          }
        },
        error: (httpErrorResponse) => {
          if (httpErrorResponse?.status == HttpStatusCode.BadRequest
            && httpErrorResponse?.error.errors
            && httpErrorResponse?.error?.errors) {
            for (const error of httpErrorResponse.error.errors) {
              if (error.errorMessage.toUpperCase().includes("EMAIL JÁ CADASTRADO")) {
                this.toastService.show('E-mail já cadastrado', { classname: 'bg-danger text-light', delay: 5000 });
              }

              if (error.errorMessage.toUpperCase().includes("TELEFONE JÁ CADASTRADO")) {
                this.toastService.show('Telefone já cadastrado', { classname: 'bg-danger text-light', delay: 5000 });
              }

              if (error.errorMessage.toUpperCase().includes("CPF JÁ CADASTRADO")) {
                this.toastService.show('CPF já cadastrado', { classname: 'bg-danger text-light', delay: 5000 });
              }
            }
          }
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
