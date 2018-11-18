import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-dashboard-demo',
  templateUrl: './dashboard-demo.component.html',
  styleUrls: ['./dashboard-demo.component.scss']
})
export class DashboardDemoComponent implements OnInit {
  dateOfDay: string = "9-9-2018";
  chart = [];
  public options: Pickadate.DateOptions = {
    format: 'dddd, dd mmm, yyyy',
    formatSubmit: 'm-d-yyyy',
    min: new Date(2016, 0, 1),
    max: new Date(2018, 8, 9),
    selectMonths: true,
    selectYears: true
  };
  constructor() { }

  ngOnInit() {
    
  }
}
