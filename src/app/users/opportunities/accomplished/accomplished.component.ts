import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/shared/models/candidate.model';
import { Issue } from 'src/shared/models/issue.model';
import { Page } from 'src/shared/models/page.model';
import { ReportIssue } from 'src/shared/models/report-issue';
import { VolunteerRegistration } from 'src/shared/models/volunteer-registration.model';
import { AccessService } from 'src/shared/services/access.service';
import { CandidateService } from 'src/shared/services/candidate.service';
import { IssueService } from 'src/shared/services/issue.service';
import { ToastService } from 'src/shared/services/toast.service';

@Component({
  selector: 'app-accomplished',
  templateUrl: './accomplished.component.html',
  styleUrls: ['./accomplished.component.css']
})

export class AccomplishedComponent implements OnInit, OnDestroy {

  instituionProblemForm: FormGroup;

  volunteerRegistrations: VolunteerRegistration[] = [];

  certificateVolunteerRegistration: VolunteerRegistration;

  currentCandidate: Candidate;

  readonly currentDate = new Date();

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;

  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private candidateService: CandidateService,
    private accessService: AccessService,
    private issueService: IssueService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.instituionProblemForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      message: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(1000)])
    });

    this.loadOpportunities();
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  openCertificate(volunteerRegistration: VolunteerRegistration, certificateModal: NgbActiveModal) {
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

  openIssue(volunteerRegistration: VolunteerRegistration, problemModal: NgbActiveModal) {
    this.certificateVolunteerRegistration = volunteerRegistration;

    this.modalService.open(problemModal, { ariaLabelledBy: 'modal-basic-title2', centered: true, size: 'lg' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  saveIssue(problemModal: NgbActiveModal) {
    this.instituionProblemForm.get('title').setValue(`Problema com a instituição ${this.certificateVolunteerRegistration.opportunity.institution.name}`);

    const { title, message } = this.instituionProblemForm.value;

    const reportIssue = {
      title,
      description: message,
      opportunityId: this.certificateVolunteerRegistration.opportunity.id,
      reportedUserId: this.certificateVolunteerRegistration.opportunity.institution.id,
    } as ReportIssue;

    this.issueService.reportIssue(reportIssue)
      .subscribe({
        next: (issue: Issue) => {
          if (issue.status === 'OPEN') {
            this.toastService.show('Problema relatado com sucesso', { classname: 'bg-success text-light', delay: 5000 });

            problemModal.close();
          }
        },
        error: error => {
          console.error(error);
        }
      });
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
}
