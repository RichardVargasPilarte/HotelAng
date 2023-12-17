import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(
    private showSpinner: NgxSpinnerService
  ) { }

  showLoading() {
    this.showSpinner.show();
  }

  hideLoading() {
    this.showSpinner.hide();
  }
}
