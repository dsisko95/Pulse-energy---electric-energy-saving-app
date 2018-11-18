import { Component } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ngx-materialize';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss']
})
export class ModalComponentComponent extends MzBaseModal {
  modalShow(): void {
    localStorage.setItem("modalShown", "false");
  }
}
