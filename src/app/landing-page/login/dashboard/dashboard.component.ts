import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../../dashboard.service';
import { TranslateService } from '@ngx-translate/core';
import { MzModalService } from 'ngx-materialize';
import { ModalComponentComponent } from '../../../modal-component/modal-component.component';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/timeout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  companyObj: Object;
  subscription: Subscription;
  language: boolean = false;
  submenuItems = document.getElementsByClassName('sidenav-thin-font');
  constructor(private translate: TranslateService,
    private dashboardService: DashboardService,
    private modalService: MzModalService) {
  }
  ngOnInit() {
    this.companyObj = this.dashboardService.getLoginObject();
    this.translate.setDefaultLang(this.companyObj["Language"]);
    this.setLanguageLever(this.companyObj["Language"]);
    this.setCurrencyChecked(this.companyObj["Currency"]);
    this.InitClickMenu();
    this.subscription = this.dashboardService.getTestServer()
      .timeout(3000)
      .subscribe(() => {
        if (this.dashboardService.getTimeoutError()) {
          if (JSON.parse(localStorage.getItem("modalShown")) || localStorage.getItem("modalShown") === null) {
            this.openServiceModal();
          }
          this.dashboardService.setTimeoutError(false);
        }
      },
        err => {});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  openServiceModal() {
    this.modalService.open(ModalComponentComponent);
  }
  setLanguageLever(data: string): void {
    const checkbox = document.querySelector('input[type="checkbox"]');
    if (data === "srb-dashboard") {
      checkbox.setAttribute("checked", "checked");
      this.language = true;
    }
  }
  setCurrencyChecked(dataParam: string): void {
    const radioButtons = Array.from(document.querySelectorAll('input[type="radio"]'));
    radioButtons.map(data => {
      if (data.getAttribute("id") === dataParam) {
        data.setAttribute("checked", "true");
      }
    });
  }
  switchLanguage(): void {
    this.language = !this.language;
    if (!this.language) {
      this.translate.use("en-dashboard");
      this.dashboardService.updateLanguage(this.companyObj["Id"], "en-dashboard").subscribe(() => { });
      this.dashboardService.detectLangChange("en-dashboard");
      localStorage.setItem("language-dashboard", "en-dashboard");

    }
    else {
      this.translate.use("srb-dashboard");
      this.dashboardService.updateLanguage(this.companyObj["Id"], "srb-dashboard").subscribe(() => { });
      this.dashboardService.detectLangChange("srb-dashboard");
      localStorage.setItem("language-dashboard", "srb-dashboard");
    }
  }
  setCurrency(data: string): void {
    this.dashboardService.detectCurrencyChange(data);
    localStorage.setItem("currency-dashboard", data);
    this.dashboardService.updateCurrency(this.companyObj["Id"], data).subscribe(() => { });
  }
  InitClickMenu(): void {
    const arrayOfLinks = Array.from(this.submenuItems);
    arrayOfLinks.map(data => {
      let icons = Array.from(document.querySelectorAll('.sidenav-thin-font i'));
      data.addEventListener("click", function () {
        icons.map(icon => {
          icon.setAttribute("class", "material-icons grey-text text-darken-1 left");
        });
        const idNumber = this.getAttribute("id");
        const icon = document.getElementById(`${Number(idNumber) + 1}`);
        icon.setAttribute("class", "material-icons white-text left");
      });
    })
  }
  goBack(): void {
    location.reload();
  }
}
