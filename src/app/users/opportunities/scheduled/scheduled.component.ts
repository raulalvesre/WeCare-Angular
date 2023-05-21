import { Component } from '@angular/core';

interface Agendado {
  name: string;
  type: number;
  date: string;
  certificate: boolean;
}

@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.css']
})
export class ScheduledComponent {

    // mock
    agendados: Array<Agendado> = [
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
