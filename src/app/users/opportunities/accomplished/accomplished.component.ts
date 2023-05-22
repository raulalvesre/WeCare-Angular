import { Component } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

export class AccomplishedComponent {

  closeResult = '';

	constructor(private modalService: NgbModal) {}

	open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'xl'  }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  openIssue(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title2', centered: true, size: 'lg'  }).result.then(
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
