import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'fab-util-modal-leave-yes-no',
  template: `
    <div class="bg-main">
      <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Bevestiging</h4>
      </div>
      <div class="modal-body">
        <p>Weet je zeker dat je deze operatie wilt uitvoeren?</p>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-secondary"
          (click)="modal.dismiss('cancel click')"
        >
          Annuleren
        </button>
        <button
          type="button"
          class="btn btn-danger"
          (click)="modal.close('Ok click')"
        >
          Doorgaan
        </button>
      </div>
    </div>
  `,
})
export class ModalLeaveYesNoComponent {
  constructor(public modal: NgbActiveModal) {}
}
