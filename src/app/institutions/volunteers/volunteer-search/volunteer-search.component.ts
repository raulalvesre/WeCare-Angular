import { HttpStatusCode, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Page } from 'src/shared/models/page.model';
import { VolunteerOpportunity } from 'src/shared/models/volunteer-opportunity.model';
import { FileService } from 'src/shared/services/file.service';
import { ToastService } from 'src/shared/services/toast.service';
import { VolunteerOpportunityService } from 'src/shared/services/volunteer-opportunity.service';
import { CandidateService } from "../../../../shared/services/candidate.service";
import { Candidate } from "../../../../shared/models/candidate.model";
import { CandidateSearchParams } from "../../../../shared/models/candidate-search-params.model";
import { OpportunityCause } from "../../../../shared/models/opportunity-cause.model";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { FederativeUnit } from "../../../../shared/models/address.model";
import { ViaCepService } from "../../../../shared/services/via-cep.service";
import { OpportunityCauseService } from "../../../../shared/services/opportunity-cause.service";
import { Qualification } from "../../../../shared/models/qualification.model";
import { QualificationService } from "../../../../shared/services/qualification.service";
import { ImageService } from 'src/shared/services/image.service';

@Component({
  selector: 'app-volunteer-search',
  templateUrl: './volunteer-search.component.html',
  styleUrls: ['./volunteer-search.component.css']
})
export class VolunteerSearchComponent implements OnInit {

  candidates: Candidate[] = [];

  currentCandidate: Candidate;
  currentVolunteerOpportunities: VolunteerOpportunity[];

  qualifications: Qualification[] = [];
  selectedQualifications: Qualification[] = [];

  federativeUnits: FederativeUnit[] = [];
  selectedFederativeUnits: FederativeUnit[] = [];

  volunteerOpportunitiesInvitesForm: FormGroup;

  pageNumber = 1;
  pageSize = 10;
  hasNextPage = false;
  isLoading = false;

  constructor(
    private volunteerOpportunityService: VolunteerOpportunityService,
    private candidateService: CandidateService,
    private toastService: ToastService,
    private fileService: FileService,
    private modalService: NgbModal,
    private viaCepService: ViaCepService,
    private opportunityCauseService: OpportunityCauseService,
    private qualificationService: QualificationService,
    public imageService: ImageService
  ) {
  }

  ngOnInit(): void {
    this.searchQualifications();
    this.searchFederativeUnits();
    this.loadCandidates();

    this.volunteerOpportunitiesInvitesForm = new FormGroup({
      volunteerOpportunitiesInvites: new FormArray([])
    });
  }

  get volunteerOpportunitiesInvites() {
    return this.volunteerOpportunitiesInvitesForm.controls['volunteerOpportunitiesInvites'] as FormArray;
  }

  private searchQualifications() {
    this.qualificationService.search()
      .subscribe({
        next: opportunityCauses => {
          this.qualifications = opportunityCauses;
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private searchFederativeUnits() {
    this.viaCepService.getFederativeUnits()
      .subscribe(federativeUnits => {
        this.federativeUnits = federativeUnits;
      });
  }


  private loadCandidates() {
    this.isLoading = true;
    const searchParams = this.getSearchParams();
    this.candidateService.search(searchParams)
      .subscribe({
        next: (page: Page<Candidate[]>) => {
          console.log(page.data)
          this.candidates = page.data;
        }
      }).add(() => this.isLoading = false);
  }

  private getSearchParams(): CandidateSearchParams {
    const params: any = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    if (this.selectedFederativeUnits.length > 0) {
      params.state = this.selectedFederativeUnits[0].abbreviation;
    }

    if (this.selectedQualifications.length > 0) {
      params.qualificationIds = this.selectedQualifications.map(x => x.id);
    }

    return params;
  }

  addQualificationToSearch(qualification: Qualification) {
    const opportunityIndex = this.selectedQualifications.indexOf(qualification);
    if (opportunityIndex >= 0) {
      return;
    }

    this.selectedQualifications.push(qualification);

    this.loadCandidates();
  }

  removeQualificationToSearch(opportunityCause) {
    const opportunityIndex = this.selectedQualifications.indexOf(opportunityCause);
    this.selectedQualifications.splice(opportunityIndex, 1);

    this.loadCandidates();
  }

  addFederativeUnitToSearch(federativeUnit: FederativeUnit) {
    // const federativeUnitIndex = this.selectedFederativeUnits.indexOf(federativeUnit);
    // if (federativeUnitIndex >= 0) {
    //   return;
    // }

    // this.selectedFederativeUnits.push(federativeUnit);


    this.selectedFederativeUnits = [federativeUnit];

    this.loadCandidates();
  }

  removeFederativeUnit(federativeUnit: FederativeUnit) {
    const federativeUnitIndex = this.selectedFederativeUnits.indexOf(federativeUnit);
    this.selectedFederativeUnits.splice(federativeUnitIndex, 1);

    this.loadCandidates();
  }

  loadMoreOpportunities() {
    this.pageNumber += 1;

    this.loadCandidates();
  }

  convertBase64ToPhotoUrl(photoBase64: string) {
    console.log(photoBase64)
    const photoExtension = this.fileService.fileExtension(photoBase64);
    return `data:image/${photoExtension};base64,${photoBase64}`;
  }

  openInviteModal(inviteModal, candidate: Candidate) {
    this.currentCandidate = candidate;

    this.volunteerOpportunityService
      .search({
        candidateNotRegistered: this.currentCandidate.id
      })
      .subscribe({
        next: page => {
          if (Array.isArray(page.data) && page.data.length > 0) {
            this.currentVolunteerOpportunities = page.data;

            console.log(this.currentVolunteerOpportunities);

            this.volunteerOpportunitiesInvites.clear();

            for (const volunteerOpportunity of this.currentVolunteerOpportunities) {
              console.log(volunteerOpportunity);

              this.volunteerOpportunitiesInvites.push(new FormGroup({
                opportunityId: new FormControl(volunteerOpportunity.id),
                name: new FormControl(volunteerOpportunity.name),
                sendInvite: new FormControl(false)
              }));
            }

            console.log([...this.volunteerOpportunitiesInvites.controls.values()]);
          }
        }
      });

    this.modalService.open(inviteModal);
  }

  existsOpportunityInviteToSend() {
    return [...this.volunteerOpportunitiesInvites.controls.values()]
      .find(volunteerOpportunityInvite => volunteerOpportunityInvite.value.sendInvite)
  }

  inviteCandidate(modal: NgbActiveModal) {
    const volunteerOpportunitiesInvites = [...this.volunteerOpportunitiesInvites.controls.values()]
      .filter(volunteerOpportunityInvite => volunteerOpportunityInvite.value.sendInvite)
      .map(volunteerOpportunityInvite => {
        console.log(volunteerOpportunityInvite);

        return {
          opportunityId: volunteerOpportunityInvite.value.opportunityId,
          name: volunteerOpportunityInvite.value.name,
          sendInvite: volunteerOpportunityInvite.value.sendInvite
        }
      });

    // TODO Enviar os convites
    console.log(volunteerOpportunitiesInvites);

    modal.close();
  }
}

