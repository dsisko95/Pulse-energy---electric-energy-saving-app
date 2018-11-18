import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Md5 } from 'ts-md5/dist/md5';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MzToastService } from 'ngx-materialize';
import { LoginService } from '../../login.service';
import { Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginLabel: boolean = true;
  resetLabel: boolean = true;
  passwordLabel: boolean = false;
  checkRequestUser: boolean;
  resetForm: FormGroup;
  resetFormPassword: FormGroup;
  loginForm: FormGroup;
  constructor(private translate: TranslateService,
    private toastService: MzToastService,
    private loginService: LoginService,
    private dashboardService: DashboardService,
    private router: Router,
  ) {
    localStorage.getItem("language") === null ?
      this.translate.setDefaultLang("en")
      : this.translate.setDefaultLang(localStorage.getItem("language"));
  }
  ngOnInit() {
    this.loginForm = new FormGroup({
      'usernameLogin': new FormControl(null, Validators.required),
      'passwordLogin': new FormControl(null, Validators.required)
    });
    this.resetForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'secQuestion': new FormControl(null, Validators.required)
    });
    this.resetFormPassword = new FormGroup({
      'newPassword': new FormControl(null, Validators.required),
      'newPasswordRepeat': new FormControl(null, Validators.required)
    });
  }
  onSubmitLogin(): void {
    if (!this.loginForm.valid) {
      localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
        this.toastService.show('Please enter required data!', 2000)
        : this.toastService.show('Молимо вас унесите тражене податке!', 2000);
    } else {
      const usernameLogin = this.loginForm.value.usernameLogin;
      const passwordLogin = this.loginForm.value.passwordLogin;
      if (usernameLogin.trim() === "" || passwordLogin.trim() === "") {
        localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
          this.toastService.show('Please enter data without spaces!', 2000)
          : this.toastService.show('Молимо вас унесите податке без размака!', 2000);
      } else {
        this.loginService.loginRequest(usernameLogin, Md5.hashStr(passwordLogin).toString()).subscribe(data => {
          if (!data['Company_Name']) {
            localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
              this.toastService.show('Combination of provided data is not valid!', 2000)
              : this.toastService.show('Неисправна комбинација података!', 2000);
            this.loginForm.reset();
          } else {
            this.loginService.setUserLogged();
            this.dashboardService.sendLoginObject(data);
            localStorage.setItem("language-dashboard", (this.dashboardService.getLoginObject())["Language"]);
            localStorage.setItem("currency-dashboard", (this.dashboardService.getLoginObject())["Currency"]);
            this.router.navigate(['/dashboard/overview']);
          }
        });
      }
    }
  }
  onSubmitReset(): void {
    if (!this.resetForm.valid) {
      localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
        this.toastService.show('Please enter required data!', 2000)
        : this.toastService.show('Молимо вас унесите тражене податке!', 2000);
    } else {
      const username = this.resetForm.value.username;
      const secQuestion = this.resetForm.value.secQuestion;
      if (username.trim() === "" || secQuestion.trim() === "") {
        localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
          this.toastService.show('Please enter data without spaces!', 2000)
          : this.toastService.show('Молимо вас унесите податке без размака!', 2000);
      } else {
        this.loginService.resetRequest(username, Md5.hashStr(secQuestion).toString())
          .subscribe(data => {
            this.checkRequestUser = data
            if (!this.checkRequestUser) {
              localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
                this.toastService.show('Combination of provided data is not valid!', 2000)
                : this.toastService.show('Неисправна комбинација података!', 2000);
              this.resetForm.reset();
            } else {
              this.loginLabel = false;
              this.resetLabel = false;
              this.passwordLabel = true;
              document.querySelector('.mat-ink-bar').removeAttribute("class");
            }
          });
      }
    }
  }
  onSubmitResetPassword(): void {
    if (!this.resetFormPassword.valid) {
      localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
        this.toastService.show('Please enter required data!', 2000)
        : this.toastService.show('Молимо вас унесите тражене податке!', 2000);
    } else {
      const newPassword = this.resetFormPassword.value.newPassword;
      const newPasswordRepeat = this.resetFormPassword.value.newPasswordRepeat;
      if (newPassword.trim() === "" || newPasswordRepeat.trim() === "") {
        localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
          this.toastService.show('Please enter data without spaces!', 2000)
          : this.toastService.show('Молимо вас унесите податке без размака!', 2000);
      } else {
        if (newPassword !== newPasswordRepeat) {
          localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
            this.toastService.show('Entered password fields must be the same!', 2000)
            : this.toastService.show('Поља за лозинке морају бити исте!', 2000);
        } else {
          this.loginService.updatePassword(this.resetForm.value.username, Md5.hashStr(newPassword).toString()).subscribe(() => {
            localStorage.getItem("language") === 'en' || localStorage.getItem("language") === null ?
              this.toastService.show('You have successfully changed your password!', 3000)
              : this.toastService.show('Успешно сте променили лозинку!', 3000);
            window.location.reload();
          });
        }
      }
    }
  }
}
