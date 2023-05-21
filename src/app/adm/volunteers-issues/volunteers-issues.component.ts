import { Component } from '@angular/core';

interface issues {
  name: string;
  type: number;
  date: string;
  location: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-volunteers-issues',
  templateUrl: './volunteers-issues.component.html',
  styleUrls: ['./volunteers-issues.component.css']
})
export class VolunteersIssuesComponent {

  userIssues: Array<issues> =[
    { name: 'Distribuição de Alimentos', type: 2, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 1', status: "Pendente" },
    { name: 'Teste 2', type: 1, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 2' , status: "Pendente"},
    { name: 'Teste 3', type: 3, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 3', status: "Pendente" },
    // { name: 'Teste 4', type: 5, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 4' },
    // { name: 'Teste 5', type: 4, date: "22/07/2023", location: "Jabaquara - Sp", description: 'Esse é o teste 5' },
  ]
}
