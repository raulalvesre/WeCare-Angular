import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordConfirmationValidator } from 'src/app/users/forms/forms.component';
import { UserDocumentType } from 'src/shared/models/document-type.model';
import { AccessService } from 'src/shared/services/access.service';
import { ToastService } from 'src/shared/services/toast.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent {
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
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      passwordConfirmation: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    }, [passwordConfirmationValidator()]);
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
