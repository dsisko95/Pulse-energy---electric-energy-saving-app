import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  res: string = '600px';
  language: string;
  oppositeLanguage: string;
  dropdownArray = [];
  dropdownLang = [];
  constructor(private translate: TranslateService) {
    localStorage.getItem("language") === null || localStorage.getItem("language") === "en" ? 
    this.translate.setDefaultLang("en") :  this.translate.setDefaultLang("srb");
  }
  switchLanguage(language: string):void {
    this.translate.use(language);
    localStorage.setItem("language", language);
    if (localStorage.getItem("language") === "en") {
      this.language = "English"
      this.oppositeLanguage = "Српски"
    } else {
      this.language = "Српски";
      this.oppositeLanguage = "English"
    }
    this.removeClassToDropdown();
    this.setClassToDropdown();
  }
  setClassToDropdown():void {
    this.dropdownLang = this.dropdownArray.filter(data => data.innerHTML === (localStorage.getItem("language") === "en" || localStorage.getItem("language") === null ? 
    this.language = "English" : this.language = "Српски"));
    this.dropdownLang.map(data => data.setAttribute("class", "grey lighten-2 black-text"));
  }
  removeClassToDropdown():void {
    this.dropdownLang = this.dropdownArray.filter(data => data.innerHTML === (localStorage.getItem("language") === "en" || localStorage.getItem("language") === null ? 
    this.oppositeLanguage = "Српски" : this.language = "English"));
    this.dropdownLang.map(data => data.setAttribute("class", "black-text"));
  }
  ngOnInit() {
    this.dropdownArray = Array.from(document.querySelectorAll("mz-dropdown a"));
    this.setClassToDropdown();
  }
  
}
