import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cant-find',
  templateUrl: './cant-find.component.html',
  styleUrls: ['./cant-find.component.scss']
})
export class CantFindComponent implements OnInit {
  constructor(private translate: TranslateService) {
    localStorage.getItem("language") === null ?  translate.setDefaultLang("en") :  translate.setDefaultLang(localStorage.getItem("language"));
  }
  ngOnInit() {

  }

}
