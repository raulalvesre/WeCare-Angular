import { Component } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface issues {
  id: number,
  status: string,
  opportunityId: number,
  title: string,
  description: string,
  resolutionNotes: string,
  reportedUserId: number,
  reporterId: number,
  creationDate: Date
}

@Component({
  selector: 'app-institutions-issues',
  templateUrl: './institutions-issues.component.html',
  styleUrls: ['./institutions-issues.component.css']
})
export class InstitutionsIssuesComponent {

  closeResult = '';

  constructor(private modalService: NgbModal) { }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' }).result.then(
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

  oportunityIssues: Array<issues> = [
    {
      id: 1,
      status: 'Open',
      opportunityId: 32,
      title: 'string',
      description: 'o que aconteceu foi que...',
      resolutionNotes: 'string',
      reportedUserId: 1,
      reporterId: 1,
      creationDate: new Date()
    },
    {
      id: 1,
      status: 'Open',
      opportunityId: 32,
      title: 'string',
      description: 'o que aconteceu foi que...',
      resolutionNotes: 'string',
      reportedUserId: 1,
      reporterId: 1,
      creationDate: new Date()
    },
    {
      id: 1,
      status: 'Open',
      opportunityId: 32,
      title: 'string',
      description: 'o que aconteceu foi que...',
      resolutionNotes: 'string',
      reportedUserId: 1,
      reporterId: 1,
      creationDate: new Date()
    },
    {
      id: 1,
      status: 'Open',
      opportunityId: 32,
      title: 'string',
      description: 'o que aconteceu foi que...',
      resolutionNotes: 'string',
      reportedUserId: 1,
      reporterId: 1,
      creationDate: new Date()
    },
    {
      id: 1,
      status: 'Open',
      opportunityId: 32,
      title: 'string',
      description: 'o que aconteceu foi que...',
      resolutionNotes: 'string',
      reportedUserId: 1,
      reporterId: 1,
      creationDate: new Date()
    },
  ]

}
