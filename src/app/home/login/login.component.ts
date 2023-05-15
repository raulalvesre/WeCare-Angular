import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDocumentType } from 'src/shared/models/document-type.model';
import { AccessService } from 'src/shared/services/access.service';
import { ToastService } from 'src/shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  readonly cpf = UserDocumentType.cpf;
  readonly cnpj = UserDocumentType.cnpj;

  form: FormGroup;

  constructor(
    private router: Router,
    private accessService: AccessService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(
        '',
        [Validators.required, Validators.email]
      ),
      password: new FormControl(
        '',
        [Validators.required, Validators.minLength(6)]
      ),
      documentType: new FormControl(UserDocumentType.cpf)
    });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  login() {
    const { email, password, documentType } = this.form.value;

    this.accessService.login({
      email,
      password,
      documentType
    }).subscribe({
      next: () => {
        this.toastService.show('Acesso autorizado', { classname: 'bg-success text-light', delay: 5000 });

        setTimeout(() => {
          this.router.navigate(['/opportunities-admin']);
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == HttpStatusCode.Unauthorized) {
          this.toastService.show('E-mail ou senha inválidos', { classname: 'bg-danger text-light', delay: 5000 });
        }

        if (error.status == HttpStatusCode.NotFound) {
          this.toastService.show('Cadastro não encontrado', { classname: 'bg-danger text-light', delay: 5000 });
        }
      }
    });
  }

  changeDocumentType(documentType: UserDocumentType) {
    this.form.get('documentType').setValue(documentType);
  }

}
