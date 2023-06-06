import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged, delay } from 'rxjs';
import { OpportunityCause } from 'src/shared/models/opportunity-cause.model';
import { Qualification } from 'src/shared/models/qualification.model';
import { AccessService } from 'src/shared/services/access.service';
import { OpportunityCauseService } from 'src/shared/services/opportunity-cause.service';
import { QualificationService } from 'src/shared/services/qualification.service';
import { ToastService } from 'src/shared/services/toast.service';
import { ViaCepService } from 'src/shared/services/via-cep.service';
import { CandidateService } from 'src/shared/services/candidate.service';
import { Candidate } from 'src/shared/models/candidate.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  readonly allowEditEmail = false;

  currentCandidate: Candidate;

  form: FormGroup;

  currentPhotoFile: File;

  qualifications: Qualification[] = [];
  selectedQualifications: Qualification[] = [];

  opportunityCauses: OpportunityCause[] = [];
  selectedOpportunityCauses: OpportunityCause[] = [];

  postalCodeInvalid = false;

  constructor(
    private router: Router,
    private accessService: AccessService,
    private qualificationService: QualificationService,
    private opportunityCauseService: OpportunityCauseService,
    private toastService: ToastService,
    private viaCepService: ViaCepService,
    private candidateService: CandidateService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      telephone: new FormControl(null, [Validators.required, Validators.minLength(14)]),
      birthDate: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      biography: new FormControl(null, [Validators.required, Validators.minLength(12)]),
      cpf: new FormControl(null, [Validators.required, Validators.minLength(14), Validators.maxLength(18)]),
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

    this.searchCandidate();

    this.searchQualifications();

    this.searchOpportunityCauses();
  }

  private searchCandidate() {
    const currentUser = this.accessService.getCurrentUser();

    this.candidateService.searchCandidate(currentUser.id)
      .subscribe({
        next: candidate => {
          this.currentCandidate = candidate;

          console.log(candidate);

          this.form.get('email').setValue(this.currentCandidate.email);
          this.form.get('name').setValue(this.currentCandidate.name);
          this.form.get('telephone').setValue(this.currentCandidate.telephone);
          this.form.get('birthDate').setValue(this.currentCandidate.birthDate);
          this.form.get('biography').setValue(this.currentCandidate.bio);
          this.form.get('cpf').setValue(this.currentCandidate.cpf);
          this.form.get('address').get('street').setValue(this.currentCandidate.address.street);
          this.form.get('address').get('number').setValue(this.currentCandidate.address.number);
          this.form.get('address').get('complement').setValue(this.currentCandidate.address.complement);
          this.form.get('address').get('city').setValue(this.currentCandidate.address.city);
          this.form.get('address').get('neighborhood').setValue(this.currentCandidate.address.neighborhood);
          this.form.get('address').get('state').setValue(this.currentCandidate.address.state);
          this.form.get('address').get('postalCode').setValue(this.currentCandidate.address.postalCode);
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private searchQualifications() {
    this.qualificationService.search()
      .subscribe({
        next: qualifications => {
          this.qualifications = qualifications;
        },
        error: error => { console.error(error); }
      });
  }

  private searchOpportunityCauses() {
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

  changeProfilePhoto(files: FileList) {
    if (files?.length > 0) {
      this.currentPhotoFile = files[0];

      const phofileImagePreview: HTMLImageElement = document.querySelector('#phofileImagePreview');
      phofileImagePreview.src = URL.createObjectURL(this.currentPhotoFile);
    }
  }

  clearProfilePhoto() {
    this.currentPhotoFile = null;

    const phofileImagePreview: HTMLImageElement = document.querySelector('#phofileImagePreview');
    phofileImagePreview.src = '';
  }

  saveProfilePhoto() {
    const photoFormData = new FormData();
    photoFormData.append('photo', this.currentPhotoFile);

    this.candidateService.updatePhoto(this.currentCandidate, photoFormData)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.ok) {
            this.toastService.show('Foto atualizada com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          }
        }, error: error => {
          console.error(error);
        }
      });
  }

  addQualification(qualificationId: number) {
    const selectedQualification = this.qualifications.find(qualification => qualification.id == qualificationId);

    const qualificationAlreadyAdded = this.selectedQualifications.find(qualification => qualification.id == selectedQualification.id);
    if (!qualificationAlreadyAdded) {
      this.selectedQualifications.push(selectedQualification);
    }
  }

  removeQualification(qualification: Qualification) {
    const qualificationIndex = this.selectedQualifications.indexOf(qualification);
    this.selectedQualifications.splice(qualificationIndex, 1);
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

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  save() {
    const {
      email,
      name,
      telephone,
      birthDate,
      biography,
      cpf,
      address
    } = this.form.value;

    const candidate: Candidate = {
      id: this.currentCandidate.id,
      email: email.trim(),
      name: name.trim(),
      telephone: telephone.trim(),
      cpf: cpf.trim(),
      birthDate,
      bio: biography,
      address: {
        street: address.street.trim(),
        number: address.number,
        complement: address.complement?.trim(),
        city: address.city.trim(),
        neighborhood: address.neighborhood.trim(),
        state: address.state.trim(),
        postalCode: address.postalCode.trim()
      }
    };

    if (this.selectedQualifications.length == 0) {
      candidate.qualificationsIds = [];
    } else {
      candidate.qualificationsIds = this.selectedQualifications
        .map(qualification => qualification.id);
    }

    if (this.selectedOpportunityCauses.length == 0) {
      candidate.interestedInCausesIds = [];
    } else {
      candidate.interestedInCausesIds = this.selectedOpportunityCauses
        .map(opportunityCause => opportunityCause.id);
    }

    this.candidateService.update(candidate)
      .subscribe({
        next: httpResponse => {
          if (httpResponse.status == HttpStatusCode.Ok) {
            this.toastService.show('Cadastro atualizado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          }
        },
        error: (httpErrorResponse) => {
          // if (httpErrorResponse?.status == HttpStatusCode.BadRequest
          //   && httpErrorResponse?.error.errors
          //   && httpErrorResponse?.error?.errors) {
          //   for (const error of httpErrorResponse.error.errors) {
          //     if (error.errorMessage.toUpperCase().includes("EMAIL JÁ CADASTRADO")) {
          //       this.toastService.show('E-mail já cadastrado', { classname: 'bg-danger text-light', delay: 5000 });
          //     }

          //     if (error.errorMessage.toUpperCase().includes("TELEFONE JÁ CADASTRADO")) {
          //       this.toastService.show('Telefone já cadastrado', { classname: 'bg-danger text-light', delay: 5000 });
          //     }

          //     if (error.errorMessage.toUpperCase().includes("CPF JÁ CADASTRADO")) {
          //       this.toastService.show('CPF já cadastrado', { classname: 'bg-danger text-light', delay: 5000 });
          //     }
          //   }
          // }
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
