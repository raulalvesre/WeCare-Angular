import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpportunityInvitation } from 'src/shared/models/opportunity-invitation.model';
import { Page } from 'src/shared/models/page.model';
import { AccessService } from 'src/shared/services/access.service';
import { ImageService } from 'src/shared/services/image.service';
import { OpportunityInvitationService } from 'src/shared/services/opportunity-invitation.service';
import { ToastService } from 'src/shared/services/toast.service';

@Component({
  selector: 'app-opportunity-invite',
  templateUrl: './opportunity-invite.component.html',
  styleUrls: ['./opportunity-invite.component.css']
})
export class OpportunityInviteComponent implements OnInit, OnDestroy {

  opportunityInvitations: OpportunityInvitation[] = [];

  currentOpportunityInvitation: OpportunityInvitation;

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;

  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private accessService: AccessService,
    private opportunityInvitationService: OpportunityInvitationService,
    private toastService: ToastService,
    public imageService: ImageService,
  ) { }

  ngOnInit(): void {
    this.loadOpportunityInvitations();
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  invitationStatus(opportunityInvitation: OpportunityInvitation) {
    switch (opportunityInvitation.status) {
      case 'PENDING':
        return 'Pendente';

      case 'ACCEPTED':
        return 'Aceito';

      case 'DENIED':
        return 'Negado';

      case 'CANCELED':
        return 'Convite cancelado';
    }
  }

  opportunityInvitationPending(opportunityInvitation: OpportunityInvitation) {
    return opportunityInvitation.status == 'PENDING';
  }

  acceptInvite(opportunityInvitation: OpportunityInvitation) {
    this.opportunityInvitationService.acceptInvite(opportunityInvitation, 'Convite aceito')
      .subscribe({
        next: httpStatus => {
          if (httpStatus.ok) {
            this.toastService.show('Convite aceito com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          }
        },
        error: error => {
          console.error(error);
        }
      });
  }

  denyInvite(opportunityInvitation: OpportunityInvitation) {
    this.opportunityInvitationService.denyInvite(opportunityInvitation, 'Convite recusado')
      .subscribe({
        next: httpStatus => {
          if (httpStatus.ok) {
            this.toastService.show('Convite recusado com sucesso', { classname: 'bg-success text-light', delay: 5000 });
          }
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private loadOpportunityInvitations() {
    const currentUser = this.accessService.getCurrentUser();

    const candidateId = currentUser.id;

    this.opportunityInvitationService.searchInvites({ candidateId })
      .subscribe({
        next: (page: Page<OpportunityInvitation[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.opportunityInvitations.length == 0) {
              this.opportunityInvitations = page.data;
            } else {
              this.opportunityInvitations.push(...page.data);
            }
          }
        }, error: error => {
          console.error(error);
        }
      });
  }

  openInviteDetails(opportunityInvitation: OpportunityInvitation, inviteDetailsModal: NgbActiveModal) {
    this.currentOpportunityInvitation = opportunityInvitation;

    this.modalService.open(inviteDetailsModal, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
