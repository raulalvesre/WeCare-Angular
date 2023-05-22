import { Component } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface issues {
  name: string;
  type: number;
  date: string;
  location: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-institutions-issues',
  templateUrl: './institutions-issues.component.html',
  styleUrls: ['./institutions-issues.component.css']
})
export class InstitutionsIssuesComponent {
  
  closeResult = '';

	constructor(private modalService: NgbModal) {}

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

  oportunityIssues: Array<issues> =[
    { name: 'Distribuição de Alimentos', type: 2, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 1', status: "Pendente" },
    { name: 'Teste 2', type: 1, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 2' , status: "Pendente"},
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    // { name: 'Teste 4', type: 5, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 4' },
    // { name: 'Teste 5', type: 4, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 5' },
  ]

}
