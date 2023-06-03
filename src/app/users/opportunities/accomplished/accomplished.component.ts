import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/shared/models/candidate.model';
import { Page } from 'src/shared/models/page.model';
import { VolunteerRegistration } from 'src/shared/models/volunteer-registration.model';
import { AccessService } from 'src/shared/services/access.service';
import { CandidateService } from 'src/shared/services/candidate.service';

interface Realizada {
  name: string;
  type: number;
  date: string;
  certificate: boolean;
}

@Component({
  selector: 'app-accomplished',
  templateUrl: './accomplished.component.html',
  styleUrls: ['./accomplished.component.css']
})

export class AccomplishedComponent implements OnInit {

  volunteerRegistrations: VolunteerRegistration[] = [];

  certificateVolunteerRegistration: VolunteerRegistration;

  currentCandidate: Candidate;

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;

  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private candidateService: CandidateService,
    private accessService: AccessService
  ) { }

  openCertificate(volunteerRegistration: VolunteerRegistration, certificateModal) {
    this.certificateVolunteerRegistration = volunteerRegistration;

    const currentUser = this.accessService.getCurrentUser();

    this.candidateService.searchCandidate(currentUser.id)
      .subscribe({
        next: candidate => {
          this.currentCandidate = candidate;

          this.modalService.open(certificateModal, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'xl' }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            },
          );
        },
        error: error => {
          console.error(error);
        }
      });
  }

  openIssue(problemModal) {
    this.modalService.open(problemModal, { ariaLabelledBy: 'modal-basic-title2', centered: true, size: 'lg' }).result.then(
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

  ngOnInit(): void {
    this.loadOpportunities();
  }

  loadMoreOpportunities() {
    this.pageNumber += 1;

    this.loadOpportunities();
  }

  volunteerOpportunityAddress(volunteerRegistration: VolunteerRegistration) {
    const address = volunteerRegistration.opportunity.address;

    return `${address.neighborhood} (${address.city} - ${address.state})`;
  }

  private loadOpportunities() {
    const currentUser = this.accessService.getCurrentUser();

    this.candidateService
      .searchAcceptedRegistrations({
        candidateId: currentUser.id,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
      .subscribe({
        next: (page: Page<VolunteerRegistration[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.volunteerRegistrations.length == 0) {
              this.volunteerRegistrations = page.data;
            } else {
              this.volunteerRegistrations.push(...page.data);
            }
          }
        }
      });
  }

  // mock
  realizados: Array<Realizada> = [
    { name: 'Teste 1', type: 2, date: "22/07/2023", certificate: true },
    { name: 'Teste 2', type: 2, date: "25/07/2023", certificate: true },
    { name: 'Teste 3', type: 2, date: "22/08/2023", certificate: true },
    { name: 'Teste 4', type: 2, date: "21/07/2023", certificate: false },
    { name: 'Teste 5', type: 2, date: "21/07/2023", certificate: false },
    { name: 'Teste 6', type: 2, date: "21/07/2023", certificate: false },
    { name: 'Teste 7', type: 2, date: "21/07/2023", certificate: false },
    { name: 'Teste 8', type: 2, date: "21/07/2023", certificate: false },
    { name: 'Teste 9', type: 2, date: "21/07/2023", certificate: false },
    { name: 'Teste 10', type: 2, date: "21/07/2023", certificate: false },
    { name: 'Teste 11', type: 2, date: "21/07/2023", certificate: false },
  ]
}
