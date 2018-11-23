import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal',
  styleUrls: ['modal.component.scss'],
  template: `
    <div class="modal" [ngClass]="{'open': open}">
      <div class="modal__container">
        <div [innerHTML]="bodyText"></div>
        <button type="button" class="btn" (click)="closeModal()">Got it</button>
      </div>
      <div class="modal__background" (click)="closeModal()"></div>
    </div>
  `
})
export class ModalComponent {
  @Input() bodyText: string;
  @Input() open: boolean;

  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  closeModal() {
    this.close.emit();
  }
}
