import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from 'src/shared/models/candidate.model';
import {Issue} from 'src/shared/models/issue.model';
import {Page} from 'src/shared/models/page.model';
import {ReportIssue} from 'src/shared/models/report-issue';
import {VolunteerRegistration} from 'src/shared/models/volunteer-registration.model';
import {AccessService} from 'src/shared/services/access.service';
import {CandidateService} from 'src/shared/services/candidate.service';
import {FileService} from 'src/shared/services/file.service';
import {IssueService} from 'src/shared/services/issue.service';
import {ToastService} from 'src/shared/services/toast.service';
import {ParticipationCertificateService} from "../../../../shared/services/participation.certificate.service";
import {ParticipationCertificate} from "../../../../shared/models/participation-certificate.model";
import {InstitutionService} from "../../../../shared/services/institution.service";
import {Institution} from "../../../../shared/models/institution.model";
import {VolunteerOpportunity} from "../../../../shared/models/volunteer-opportunity.model";
import {OpportunityModalComponent} from "../../../../shared/components/opportunity-modal/opportunity-modal.component";
import {HttpStatusCode} from "@angular/common/http";
import {IssueSearchParams} from "../../../../shared/models/issue-search-params.model";

@Component({
  selector: 'app-accomplished',
  templateUrl: './accomplished.component.html',
  styleUrls: ['./accomplished.component.css'],
})

export class AccomplishedComponent implements OnInit, OnDestroy {

  instituionProblemForm: FormGroup;

  participationCertificates: ParticipationCertificate[] = [];

  participationCertificate: ParticipationCertificate;

  currentCandidate: Candidate;
  candidateIssues: Issue[] = [];

  readonly currentDate = new Date();

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;

  closeResult = '';
  isLoading: boolean = true;

  constructor(
    private modalService: NgbModal,
    private candidateService: CandidateService,
    private accessService: AccessService,
    private issueService: IssueService,
    private toastService: ToastService,
    private fileService: FileService,
    private participationCertificateService: ParticipationCertificateService,
    private institutionService: InstitutionService,
  ) {
  }

  ngOnInit(): void {
    this.instituionProblemForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      opportunityId: new FormControl(0, [Validators.required]),
      reportedUserId: new FormControl(0, [Validators.required])
    });

    this.loadCertificates();
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  openCertificate(certificate: ParticipationCertificate, certificateModal: any) {
    this.participationCertificate = certificate;

    const currentUser = this.accessService.getCurrentUser();

    this.candidateService.searchCandidate(currentUser.id)
      .subscribe({
        next: candidate => {
          this.currentCandidate = candidate;

          this.modalService.open(certificateModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            size: 'xl'
          }).result.then(
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

  openIssue(certificate: ParticipationCertificate, problemModal: any) {
    this.participationCertificate = certificate;

    this.modalService.open(problemModal, {
      ariaLabelledBy: 'modal-basic-title2',
      centered: true,
      size: 'lg'
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  openOpportunityModal(certificate: ParticipationCertificate, opportunityModal: any) {
    this.participationCertificate = certificate;

    this.modalService.open(opportunityModal, {
      ariaLabelledBy: 'modal-basic-title2',
      centered: true,
      size: 'lg'
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  saveIssue(problemModal: any) {
    const {title, description, opportunityId, reportedUserId} = this.instituionProblemForm.value;

    const reportIssue = {
      title,
      description: description,
      opportunityId: this.participationCertificate.registration.opportunity.id,
      reportedUserId: this.participationCertificate.registration.opportunity.institutionId,
    } as ReportIssue;


    this.issueService.reportIssue(reportIssue)
      .subscribe({
        next: (issue: Issue) => {
          if (issue.status === 'OPEN') {

            problemModal.close();
          }
        },
        error: error => {
          if (error.status == HttpStatusCode.Conflict) {
            this.toastService.show('Você ja relatou problema com essa vaga', {
              classname: 'bg-danger text-light',
              delay: 5000
            });
            problemModal.close();
          }
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


  loadMoreCertificates() {
    this.pageNumber += 1;

    this.loadCertificates();
  }


  volunteerOpportunityCompleteAddress(opportunity: VolunteerOpportunity) {
    const address = opportunity.address;

    return `${address.street},  ${address.number} - ${address.neighborhood} - (${address.city} - ${address.state})`
  }

  private loadCertificates() {
    const currentUser = this.accessService.getCurrentUser();
    this.isLoading = true;

    this.participationCertificateService
      .searchParticipationCertificates(currentUser.id)
      .subscribe({
        next: (page: Page<ParticipationCertificate[]>) => {
          if (page.data != null) {
            this.hasNextPage = page.hasNextPage;

            if (this.participationCertificates.length == 0) {
              this.participationCertificates = page.data;
            } else {
              this.participationCertificates.push(...page.data);
            }

            for (let certificate of this.participationCertificates) {
              this.institutionService.get(certificate.registration.opportunity.institutionId)
                .subscribe({
                  next: (inst: Institution) => {
                    certificate.registration.opportunity.institution = inst;
                    this.issueService.search({reporterId: currentUser.id}).subscribe({
                      next: (page: Page<Issue[]>) => {
                        this.candidateIssues = page.data;
                      }
                    })
                  }
                })
            }
          }
        }
      }).add(() => this.isLoading = false);
  }

  candidateHasAlreadyReportedOpportunity(opportunityId: number): boolean {
    const opsIdsThatCandidateHasIssues = this.candidateIssues.map(x => x.opportunityId);
    return opsIdsThatCandidateHasIssues.includes(opportunityId);
  }


  convertBase64ToPhotoUrl(photoBase64: string) {
    const photoExtension = this.fileService.fileExtension(photoBase64);
    return `data:image/${photoExtension};base64,${photoBase64}`;
  }
}
