import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccessService } from 'src/shared/services/access.service';
import { ToastService } from 'src/shared/services/toast.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent {
  activateAccountToken: string;

  showAccessLoginButton = false;

  constructor(
    private route: ActivatedRoute,
    private accessService: AccessService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.activateAccount();
  }

  private activateAccount() {
    this.route.queryParams
      .subscribe(queryParameters => {
        this.activateAccountToken = queryParameters.token;

        this.accessService.activateAccount(this.activateAccountToken)
          .subscribe({
            next: httpResponse => {
              if (httpResponse.status == HttpStatusCode.NoContent) {
                this.showAccessLoginButton = true;
              }
            },
            error: (httpErrorResponse) => {
              console.error(httpErrorResponse);
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
