import { NgIf, NgTemplateOutlet, NgFor } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/shared/services/toast.service';

@Component({
  selector: 'app-toasts-container',
  standalone: true,
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.css'],
  imports: [NgbToastModule, NgIf, NgTemplateOutlet, NgFor],
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' }
})
export class ToastsContainerComponent {
  constructor(public toastService: ToastService) { }

  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
