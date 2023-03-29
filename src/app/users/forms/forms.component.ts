import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { delay, distinctUntilChanged } from 'rxjs';
import { UserDocumentType } from '../../../shared/models/document-type.model';
import { AccessService } from '../../../shared/services/access.service';
import { ViaCepService } from 'src/shared/services/via-cep.service';
import { UserRegistration } from 'src/shared/models/user-registration.model';
import { HttpStatusCode } from '@angular/common/http';
import { ToastService } from 'src/shared/services/toast.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit, OnDestroy {
  readonly cpf = UserDocumentType.cpf;
  readonly cnpj = UserDocumentType.cnpj;

  form: FormGroup;

  postalCodeInvalid = false;

  constructor(
    private accessService: AccessService,
    private toastService: ToastService,
    private viaCepService: ViaCepService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      passwordConfirmation: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      telephone: new FormControl(null, [Validators.required, Validators.minLength(14)]),
      birthDate: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      biography: new FormControl(null, [Validators.required, Validators.minLength(12)]),
      document: new FormControl(null, [Validators.required, Validators.minLength(14), Validators.maxLength(18)]),
      documentType: new FormControl(this.cpf),
      address: new FormGroup({
        street: new FormControl(null, [Validators.required]),
        number: new FormControl(null, [Validators.min(1), Validators.max(Number.MAX_SAFE_INTEGER)]),
        complement: new FormControl(null),
        city: new FormControl(null, [Validators.required]),
        neighborhood: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        postalCode: new FormControl(null, [Validators.required, Validators.pattern(/^\d{5}\-\d{3}$/)]),
      })
    }, [passwordConfirmationValidator()]);

    this.form.get('address').get('postalCode')
      .valueChanges
      .pipe(distinctUntilChanged(), delay(200))
      .subscribe((postalCode: string) => {
        const postalCodePattern = /^\d{5}\-\d{3}$/;
        if (postalCodePattern.test(postalCode)) {
          this.searchPostalCode(postalCode);
        }
      });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  register() {
    const {
      email,
      password,
      name,
      telephone,
      birthDate,
      biography,
      document,
      documentType,
      address
    } = this.form.value;

    const userRegistration: UserRegistration = {
      email,
      password,
      name,
      telephone,
      document,
      documentType,
      birthDate,
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

    this.accessService.register(userRegistration)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.NoContent) {
            this.toastService.show('Cadastro realizado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          }
        },
        error: (httpErrorResponse) => {
          if (httpErrorResponse?.status == HttpStatusCode.BadRequest
            && httpErrorResponse?.error.errors) {
            for (const error of httpErrorResponse?.error.errors) {
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

export function passwordConfirmationValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const password = form.value.password;
    const passwordConfirmation = form.value.passwordConfirmation;

    return password == passwordConfirmation
      ? null
      : { passwordDoesNotEqualPasswordConfirmation: true };
  }
}
