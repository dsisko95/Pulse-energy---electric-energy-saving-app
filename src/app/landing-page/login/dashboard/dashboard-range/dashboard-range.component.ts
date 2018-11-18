import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../../../dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MzToastService } from 'ngx-materialize';
import { Chart } from 'chart.js';
import { saveAs } from 'file-saver';
import 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-dashboard-range',
  templateUrl: './dashboard-range.component.html',
  styleUrls: ['./dashboard-range.component.scss']
})
export class DashboardAdvancedComponent implements OnInit, OnDestroy {
  floorSubscription: Subscription;
  languageSubscription: Subscription;
  currencySubscription: Subscription;
  mainSubs: Subscription;
  maxMonth: string;
  minMonth: string;
  dateOfDayMin: string = "9-1-2018";
  dateOfDayMax: string = "9-9-2018";
  dateOfDayMinNg: string = "9-1-2018";
  dateOfDayMaxNg: string = "9-9-2018";
  langChanged: string;
  firstFloor: string;
  secondFloor: string;
  basement: string;
  Office: string;
  currencyPrefix: string;
  spentCurrency: number;
  lowSpentPercentage: string;
  co2Emmision: string;
  highSpent: number;
  lowSpent: number;
  kwValue: string;
  co2EmmisionHour: string;
  highSpentCharge: number;
  lowSpentCharge: number;
  currencyMultiply: number;
  highSpentTarriff: number = 6;
  lowSpentTariff: number = 1.5;
  total: number;
  maxMonthValue: number;
  minMonthValue: number;
  totalTillNow: any;
  totalColumnsSum = [];
  totalSpent = [];
  lowSpentArray = [];
  highSpentArray = [];
  chartFloor = [];
  chart = [];
  chartBar = [];
  language: Object;
  subscription: Subscription;
  public options: Pickadate.DateOptions = {
    format: 'dddd, dd mmm, yyyy',
    formatSubmit: 'm-d-yyyy',
    min: new Date(2016, 0, 1),
    max: new Date(2018, 8, 9),
    selectMonths: true,
    selectYears: true
  };
  constructor(private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private toastService: MzToastService
  ) {

  }
  ngOnInit() {
    this.langChanged = localStorage.getItem("language-dashboard");
    this.checkCurrencyFormat(localStorage.getItem("currency-dashboard"));
    this.languageSubscription = this.dashboardService.getLangChange().subscribe(data => {
      this.langChanged = data;
      localStorage.setItem("language-dashboard", data);
      this.checkCurrencyFormat(localStorage.getItem("currency-dashboard"));
      this.initDataAfterLangChange();
    });
    this.currencySubscription = this.dashboardService.getCurrencyChange().subscribe(data => {
      this.checkCurrencyFormat(data);
      this.initDataAfterLangChange();
    });
    this.initializeData();
  }
  ngOnDestroy() {
    this.floorSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
    this.mainSubs.unsubscribe();
  }
  checkCurrencyFormat(data: string) {
    if (data === "rsd") {
      if (localStorage.getItem("language-dashboard") === "en-dashboard") {
        this.currencyPrefix = "rsd";
      } else {
        this.currencyPrefix = "динара";
      }
      this.currencyMultiply = 1;
    } else if (data === "euro") {
      if (localStorage.getItem("language-dashboard") === "en-dashboard") {
        this.currencyPrefix = "euros";
      } else {
        this.currencyPrefix = "евра";
      }
      this.currencyMultiply = 0.00845700;
    } else {
      if (localStorage.getItem("language-dashboard") === "en-dashboard") {
        this.currencyPrefix = "us dollars";
      } else {
        this.currencyPrefix = "долара";
      }
      this.currencyMultiply = 0.009847;
    }
  }
  initializeData(): void {
    this.spinner.show();
    this.mainSubs = this.dashboardService.getSpendingHourDateBetween(this.dateOfDayMinNg, this.dateOfDayMaxNg, this.dashboardService.getLocalUrl()).subscribe(data => {
      this.initDataRemote(data);
    });
  }
  initDataRemote(data: any) {
    this.dashboardService.getTimeoutError()
      .subscribe(dataRemote => {
        if (!dataRemote) {
          this.dashboardService.getSpendingHourDateBetween(this.dateOfDayMinNg, this.dateOfDayMaxNg, this.dashboardService.getRemoteUrl()).subscribe(dataRemote => {
            if (dataRemote !== null) {
              dataRemote.map(dataRemoteItem => { this.totalColumnsSum.push(dataRemoteItem) });
              data.map((dataItem, index) => {
                if (this.totalColumnsSum[index] === undefined) {
                  this.totalColumnsSum.push(dataItem);
                } else {
                  this.totalColumnsSum[index]['Total'] += dataItem['Total'];
                }
              });
            } else {
              data.map(dataItem => this.totalColumnsSum.push(dataItem));
            }
            this.initStatistics(this.totalColumnsSum);
          });
        } else {
          data.map(dataItem => this.totalColumnsSum.push(dataItem));
          this.initStatistics(this.totalColumnsSum);
        }
      });
  }
  initStatistics(data: any): void {
    data.forEach(data => this.totalSpent.push(data['Total'] / 1000));
    this.total = this.totalSpent.reduce((prev, next) => prev + next, 0);
    data.forEach(data => { if (data['Hour'] >= '6' && data['Hour'] < '22') { this.highSpentArray.push(data['Total'] / 1000); } });
    data.forEach(data => {
      if (data['Hour'] >= '22') {
        this.lowSpentArray.push(data['Total'] / 1000);
      }
      if (data['Hour'] >= '0' && data['Hour'] <= '5') {
        this.lowSpentArray.push(data['Total'] / 1000);
      }
    });
    let highSpent = this.highSpentArray.reduce((prev, next) => prev + next, 0);
    let lowSpent = this.lowSpentArray.reduce((prev, next) => prev + next, 0);
    let highSpentFormat = highSpent * this.highSpentTarriff * this.currencyMultiply;
    let lowSpentFormat = lowSpent * this.lowSpentTariff * this.currencyMultiply;
    this.highSpentCharge = highSpent.toFixed(2);
    this.lowSpentCharge = lowSpent.toFixed(2);
    this.lowSpentPercentage = `${(lowSpentFormat / (lowSpentFormat + highSpentFormat) * 100).toFixed(0)}% `;
    this.highSpent = Number(highSpentFormat.toFixed(0));
    this.lowSpent = Number(lowSpentFormat.toFixed(0));
    this.spentCurrency = Number(highSpentFormat.toFixed(0)) + Number(lowSpentFormat.toFixed(0));
    this.kwValue = (this.total).toFixed(2);
    this.co2Emmision = (this.total * 0.60).toFixed(0);
    this.getSpendingByFloor();
  }
  getSpendingByFloor(): void {
    this.floorSubscription = this.dashboardService.getSpendingByFloorBetween(this.dateOfDayMinNg, this.dateOfDayMaxNg, this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingByFloorBetween(this.dateOfDayMinNg, this.dateOfDayMaxNg, this.dashboardService.getRemoteUrl())
              .subscribe(dataRemote => {
                if (dataRemote !== null) {
                  let totalColumns = this.initTotalColumns(data, dataRemote);
                  this.initSpendingByFloor(totalColumns);
                } else {
                  let totalColumns = this.initTotalColumns(data);
                  this.initSpendingByFloor(totalColumns);
                }
              })
          } else {
            let totalColumns = this.initTotalColumns(data);
            this.initSpendingByFloor(totalColumns);
          }
        });
    });

  }
  initSpendingByFloor(totalColumns: any) {
    let sumOfColumns = totalColumns.reduce((prev, next) => prev + next, 0);
    this.firstFloor = ((totalColumns[0] / sumOfColumns) * 100).toFixed(2);
    this.secondFloor = ((totalColumns[1] / sumOfColumns) * 100).toFixed(2);
    this.Office = ((totalColumns[2] / sumOfColumns) * 100).toFixed(2);
    if (totalColumns[3] === 0) {
      totalColumns[3] = undefined;
    }
    if (totalColumns[3] === undefined) {
      if (this.langChanged === "en-dashboard") {
        this.basement = "No data presented for the basement";
      } else {
        this.basement = "Нема података са мерне тачке подрум";
      }
    } else {
      if (this.langChanged === "en-dashboard") {
        this.basement = `${((totalColumns[3] / sumOfColumns) * 100).toFixed(2)}% Basement usage`;
      } else {
        this.basement = `${((totalColumns[3] / sumOfColumns) * 100).toFixed(2)}% удео коришћења подрума`;
      }
    }
    this.initializePie(totalColumns);
    this.initLineChartCalc();
    this.initBarChartCalc();
  }
  initBarChartCalc(): void {
    this.dashboardService.getSpendingByYears(this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingByYears(this.dashboardService.getRemoteUrl())
              .subscribe(dataRemote => {
                this.initBarChartArray(data, dataRemote);
              });
          } else {
            this.initBarChartArray(data);
          }
        });
    });
  }
  initLineChartCalc(): void {
    this.dashboardService.getSpendingByMonthlyYears(this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingByMonthlyYears(this.dashboardService.getRemoteUrl())
              .subscribe(dataRemote => {
                this.initLineChartArray(data, dataRemote);
              });
          } else {
            this.initLineChartArray(data);
          }
        });
    });
  }
  initBarChartArray(data: any, dataRemote = []): void {
    const ArrayOfTotals = [];
    if (dataRemote != []) {
      data.map(dataItem => {
        dataRemote.map(dataRemoteItem => {
          if (dataItem.Month === dataRemoteItem.Month && dataItem.Year === dataRemoteItem.Year) {
            dataItem.Total += dataRemoteItem.Total;
          }
        });
        ArrayOfTotals.push(dataItem.Total);
      });
    } else {
      data.map(dataItem => {
        ArrayOfTotals.push(dataItem.Total);
      });
    }
    this.totalTillNow = ArrayOfTotals.reduce((prev, current) => prev + current);
    this.co2EmmisionHour = (this.totalTillNow * 0.60).toFixed(0);
    this.initializeBarChart(ArrayOfTotals);
  }
  initLineChartArray(data: any, dataRemote = []): void {
    const Array16 = [];
    const Array17 = [];
    const Array18 = [];
    const arrayOfAllObjects = [];
    data.map(dataItem => {
      if (dataItem.Year === 2016) {
        Array16.push(dataItem.Total);
      } else if (dataItem.Year === 2017) {
        Array17.push(dataItem.Total);
      } else {
        dataRemote.map(dataRemoteItem => {
          if (dataRemoteItem.Month === dataItem.Month) {
            dataItem.Total += dataRemoteItem.Total;
          }
        });
        Array18.push(dataItem.Total);
      }
      arrayOfAllObjects.push(dataItem);
    });
    this.calculateMinMaxMonth(arrayOfAllObjects);
    this.initializeLineChart(Array16, Array17, Array18);
  }
  calculateMinMaxMonth(data: any): void {
    let maxTotal = 0;
    let maxTotalObj;
    let minTotal = data[0].Total;
    let minTotalObj;
    data.map(dataItem => {
      if (dataItem.Total > maxTotal) {
        maxTotal = dataItem.Total;
      }
    });
    data.map(dataItem => {
      if (dataItem.Total === maxTotal) {
        maxTotalObj = dataItem;
      }
    });
    data.map(dataItem => {
      if (dataItem.Total < minTotal) {
        minTotal = dataItem.Total;
      }
    });
    data.map(dataItem => {
      if (dataItem.Total === minTotal) {
        minTotalObj = dataItem;
      }
    });
    this.maxMonthValue = maxTotalObj.Total;
    this.maxMonth = `${maxTotalObj.Month}-1-${maxTotalObj.Year}`;
    this.minMonthValue = minTotalObj.Total;
    this.minMonth = `${minTotalObj.Month}-1-${minTotalObj.Year}`;
  } 
  initializePie(data: any): void {
    this.chartFloor = new Chart('canvasFloor', {
      type: 'pie',
      data: {
        labels: ['1st Floor', '2nd Floor', 'Office', 'Basement'],
        datasets: [
          {
            data: data,
            backgroundColor: ["#1976d2", "#2196f3", "#64b5f6", "#90caf9"]
          }
        ]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        }
      }
    }
    )
  }
  initializeLineChart(data16: any, data17: any, data18: any): void {
    let backgroundColor = 'white';
    Chart.plugins.register({
      beforeDraw: function (c) {
        let ctx = c.chart.ctx;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, c.chart.width, c.chart.height);
      }
    });
    Chart.defaults.global.defaultFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif";
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: "2016",
            data: data16,
            borderColor: '#1976d2',
            fill: true,
            lineTension: 0
          },
          {
            label: "2017",
            data: data17,
            borderColor: '#795548',
            fill: true,
            lineTension: 0
          },
          {
            label: "2018",
            data: data18,
            borderColor: '#424242',
            fill: true,
            lineTension: 0
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Months'
            },
            ticks: {
              autoSkip: true
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'kW/h'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        },
        plugins: {
          datalabels: {
            display: false,
            align: 'end'
          }
        }
      }
    }
    )
  }
  initializeBarChart(data: any): void {
    this.chartBar = new Chart('canvasBar', {
      type: 'bar',
      data: {
        labels: ['2016', '2017', '2018'],
        datasets: [
          {
            data: data,
            backgroundColor: '#2196f3',
            borderColor: "transparent",
            borderWidth: 42
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Years'
            },
            ticks: {
              autoSkip: true
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'kW/h'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        },
        plugins: {
          datalabels: {
            display: false,
            align: 'end'
          }
        }
      }
    }
    )
    this.spinner.hide();
  }
  initTotalColumns(data: any, dataRemote: any = []): Array<number> {
    let firstFloor = 0;
    let secondFloor = 0;
    let office = 0;
    let basement = 0;
    data.map(data => {
      if (data["Floor"] === "1st Floor") {
        firstFloor += data['Total'] / 1000;
      } else if (data["Floor"] === "2nd Floor") {
        secondFloor += data['Total'] / 1000;
      } else if (data["Floor"] === "Office") {
        office += data['Total'] / 1000;
      }
    });
    dataRemote.map(dataRemote => {
      basement += dataRemote['Total'] / 1000;
    })
    const arrayOfFloors = Array.of(firstFloor, secondFloor, office, basement);
    return arrayOfFloors;
  }
  saveDepartments(): void {
    (<Chart>this.chartFloor).options.plugins.datalabels.display = true;
    (<Chart>this.chartFloor).update();
    setTimeout(() => {
      (<Chart>document.getElementById('canvasFloor')).toBlob(function (blob) {
        saveAs(blob, "usage-department.png")
      });
    }, 1)
    setTimeout(() => {
      (<Chart>this.chartFloor).options.plugins.datalabels.display = false;
      (<Chart>this.chartFloor).update();
    }, 1);
  }
  saveChart(): void {
    (<Chart>this.chart).options.plugins.datalabels.display = true;
    (<Chart>this.chart).update();
    setTimeout(() => {
      (<Chart>document.getElementById('canvas')).toBlob(function (blob) {
        saveAs(blob, "month-year-spending.png")
      });
    }, 1)
    setTimeout(() => {
      (<Chart>this.chart).options.plugins.datalabels.display = false;
      (<Chart>this.chart).update();
    }, 1);
  }
  saveTotalYear(): void {
    (<Chart>this.chartBar).options.plugins.datalabels.display = true;
    (<Chart>this.chartBar).update();
    setTimeout(() => {
      (<Chart>document.getElementById('canvasBar')).toBlob(function (blob) {
        saveAs(blob, "total-year-spending.png")
      });
    }, 1)
    setTimeout(() => {
      (<Chart>this.chartBar).options.plugins.datalabels.display = false;
      (<Chart>this.chartBar).update();
    }, 1);
  }
  initDataAfterLangChange(): void {
    this.totalSpent = [];
    this.highSpentArray = [];
    this.lowSpentArray = [];
    this.totalColumnsSum = [];
    (<Chart>this.chartFloor).destroy();
    (<Chart>this.chart).destroy();
    (<Chart>this.chartBar).destroy();
    this.initializeData();
  }
  changeDate(dateOfDayMinNg, dateOfDayMaxNg) {
    const dateMin = new Date(dateOfDayMinNg);
    const dateMax = new Date(dateOfDayMaxNg);
    if (dateOfDayMinNg === "" || dateOfDayMaxNg === "") {
      if (localStorage.getItem("language-dashboard") === "en-dashboard") {
        this.toastService.show('Please choose a date!', 3000);
      } else {
        this.toastService.show('Молимо вас одаберите датум!', 3000);
      }
    } else if (dateMin > dateMax) {
      if (localStorage.getItem("language-dashboard") === "en-dashboard") {
        this.toastService.show('Ending date must be bigger than starting!', 3000);
      } else {
        this.toastService.show('Крајњи датум мора бити већи од почетног!', 3000);
      }
    }
    else {
      this.dateOfDayMin = dateOfDayMinNg;
      this.dateOfDayMax = this.dateOfDayMaxNg;
      this.totalSpent = [];
      this.highSpentArray = [];
      this.lowSpentArray = [];
      this.totalColumnsSum = [];
      (<Chart>this.chartFloor).destroy();
      (<Chart>this.chart).destroy();
      (<Chart>this.chartBar).destroy();
      this.initializeData();
    }
  }
}
