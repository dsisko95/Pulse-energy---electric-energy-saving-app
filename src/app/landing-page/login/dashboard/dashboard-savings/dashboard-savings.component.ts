import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../../dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MzToastService } from 'ngx-materialize';

@Component({
  selector: 'app-dashboard-savings',
  templateUrl: './dashboard-savings.component.html',
  styleUrls: ['./dashboard-savings.component.scss']
})
export class DashboardSavingsComponent implements OnInit, OnDestroy {
  basementCheck: boolean = false;
  percentageUsage: string;
  spendingTwentyTree: Subscription;
  languageSubscription: Subscription;
  currencySubscription: Subscription;
  currencyMultiply: number;
  totalLastMonth: number;
  totallySavedTillNow: string;
  savedMoney: string;
  week: number;
  totalForecastMonth: number;
  highSpentTarriff: number = 6;
  lowSpentTariff: number = 1.5;
  date: string = "9-9-2018 23:00";
  dateMonth: string = "9-9-2018";
  langChanged: string;
  currencyPrefix: string;
  totalForecastWeek: number;
  totalForecast: number;
  total: number;
  totalWeek: number;
  totalNumber: number;
  totalWeekNumber: number;
  totalMonthNumber: number;
  totalLastMonthNumber: number;
  totalMonth: number;
  floorsArray = [];
  totalColumnsSum = [];
  totalColumnsSumWeek = [];
  totalSpent = [];
  totalSpentWeek = [];
  totalColumnsSumMonth = [];
  totalSpentMonth = [];
  totalColumnsSumLastMonth = [];
  totalSpentLastMonth = [];
  highSpentArray = [];
  lowSpentArray = [];
  firstFloor = [];
  secondFloor = [];
  office = [];
  basement = [];
  devicesArray = [];
  totalColumnsSumTotally = [];
  quantityArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private toastService: MzToastService) { }

  ngOnInit() {
    this.langChanged = localStorage.getItem("language-dashboard");
    this.selectLanguageArray();
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
    this.languageSubscription.unsubscribe();
    this.currencySubscription.unsubscribe();
    this.spendingTwentyTree.unsubscribe();
  }
  selectLanguageArray(): void {
    if (this.langChanged === "en-dashboard") {
      if (this.basementCheck) {
        this.floorsArray = ['1st Floor', '2nd Floor', 'Office', 'Basement'];
      } else {
        this.floorsArray = ['1st Floor', '2nd Floor', 'Office'];
      }
      this.devicesArray = ['Air Conditioner', 'Coffee Machine', 'Computer', 'Electro engine', 'Fridge', 'Laptop', 'Light', 'Modem', 'Printer', 'Router', 'TV'];
    } else {
      if (this.basementCheck) {
        this.floorsArray = ['Први спрат', 'Други спрат', 'Канцеларија', 'Подрум'];
      } else {
        this.floorsArray = ['Први спрат', 'Други спрат', 'Канцеларија'];
      }
      this.devicesArray = ['Клима уређаји', 'Машине за кафу', 'Рачунари', 'Погонски мотори', 'Фрижидери', 'Лаптопови', 'Светла', 'Модеми', 'Штампачи', 'Рутери', 'Телевизори'];
    }
  }
  initializeData(): void {
    this.spinner.show();
    this.spendingTwentyTree = this.dashboardService.getSpendingHour23(this.dateMonth, this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingHour23(this.dateMonth, this.dashboardService.getRemoteUrl()).subscribe(dataRemote => {
              if (dataRemote !== null) {
                dataRemote.map(dataRemoteItem => { this.totalColumnsSum.push(dataRemoteItem) });
                data.map((dataItem, index) => { this.totalColumnsSum[index].Total += dataItem['Total'] });
              } else {
                data.map(dataItem => { this.totalColumnsSum.push(dataItem) });
              }
              this.initStatistics(this.totalColumnsSum);
            });
          } else {
            data.map(dataItem => { this.totalColumnsSum.push(dataItem) });
            this.initStatistics(this.totalColumnsSum);
          }
        });
    });
  }
  initStatistics(data: any): void {
    data.forEach(data => this.totalSpent.push(data['Total'] / 1000));
    this.total = (this.totalSpent.reduce((prev, next) => prev + next, 0)).toFixed(2);
    this.totalForecast = (this.totalSpent.reduce((prev, next) => prev + next, 0)).toFixed(2);
    this.totalNumber = this.total * 1.5 * this.currencyMultiply;
    this.totalForecastWeek = (this.total * 24) * 7;
    this.initWeeks();
    this.initMonths();
    this.initLastMonths();
    this.initTabelarData();
    this.initTotallySavedData();
  }
  initWeeks(): void {
    this.dashboardService.getSpendingHourDateBetween('9-3-2018', '9-9-2018', this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingHourDateBetween('9-3-2018', '9-9-2018', this.dashboardService.getRemoteUrl()).subscribe(dataRemote => {
              dataRemote.map(dataRemoteItem => { this.totalColumnsSumWeek.push(dataRemoteItem) });
              data.map((dataItem, index) => {
                if (this.totalColumnsSumWeek[index] === undefined) {
                  this.totalColumnsSumWeek.push(dataItem);
                } else {
                  this.totalColumnsSumWeek[index]['Total'] += dataItem['Total'];
                }
              });
              this.initWeekStatistics(this.totalColumnsSumWeek);
              this.totalWeekNumber = this.initPricing(this.totalColumnsSumWeek) * this.currencyMultiply;
            });
          } else {
            data.map(dataItem => this.totalColumnsSumWeek.push(dataItem));
            this.initWeekStatistics(this.totalColumnsSumWeek);
            this.totalWeekNumber = this.initPricing(this.totalColumnsSumWeek) * this.currencyMultiply;
          }
        });
    });
  }
  firstFloorCalc(floor: any, quantity: any) {
    floor.Quantity = Number(quantity);
    this.initTotalForecast();
  }
  secondFloorCalc(floor: any, quantity: any) {
    floor.Quantity = Number(quantity);
    this.initTotalForecast();
  }
  officeFloorCalc(floor: any, quantity: any) {
    floor.Quantity = Number(quantity);
    this.initTotalForecast();
  }
  basementFloorCalc(floor: any, quantity: any) {
    floor.Quantity = Number(quantity);
    this.initTotalForecast();
  }
  initTotalForecast(): void {
    let totalHourForecast = [];
    let totalsOfArr = [];
    totalHourForecast.push(...this.firstFloor, ...this.secondFloor, ...this.office, ...this.basement);
    totalHourForecast.map(totalItem => {
      totalItem['Total'] = totalItem['Quantity'] * totalItem['Spent'] / 1000;
    });
    totalHourForecast.map(dataItem => {
      totalsOfArr.push(dataItem['Total']);
    });
    this.totalForecast = (totalsOfArr.reduce((prev, next) => prev + next, 0)).toFixed(2);
    this.totalForecastWeek = (this.totalForecast * 24) * 7;
    this.totalForecastMonth = this.totalWeek + this.totalForecastWeek * 3;
    this.percentageCalcFunction();
  }
  populateFloorForecastArr(data: any): void {
    data.map(dataItem => {
      if (dataItem.Floor === "1st Floor") {
        this.firstFloor.push(dataItem);
      } else if (dataItem.Floor === "2nd Floor") {
        this.secondFloor.push(dataItem);
      } else {
        this.office.push(dataItem);
      }
    });
  }
  percentageCalcFunction(): void {
    if (this.totalForecastMonth > this.totalLastMonth) {
      let calculation = (this.totalForecastMonth / this.totalLastMonth).toFixed(2);
      if (this.langChanged === "en-dashboard") {
        this.percentageUsage = `${calculation} times more than previous month`;
      } else {
        this.percentageUsage = `${calculation} пута више него претходног месеца`;
      }
    } else {
      let calculation = (100 - ((this.totalForecastMonth / this.totalLastMonth) * 100)).toFixed(2);
      if (this.langChanged === "en-dashboard") {
        this.percentageUsage = `${calculation}% less than previous month`;
      } else {
        this.percentageUsage = `${calculation}% мање него претходног месеца`;
      }
    }
  }
  initMonths(): void {
    this.dashboardService.getSpendingHourDateBetween('9-1-2018', '9-9-2018', this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingHourDateBetween('9-1-2018', '9-9-2018', this.dashboardService.getRemoteUrl()).subscribe(dataRemote => {
              dataRemote.map(dataRemoteItem => { this.totalColumnsSumMonth.push(dataRemoteItem) });
              data.map((dataItem, index) => {
                if (this.totalColumnsSumMonth[index] === undefined) {
                  this.totalColumnsSumMonth.push(dataItem);
                } else {
                  this.totalColumnsSumMonth[index]['Total'] += dataItem['Total'];
                }
              });
              this.initMonthStatistics(this.totalColumnsSumMonth);
              this.totalMonthNumber = this.initPricing(this.totalColumnsSumMonth) * this.currencyMultiply;
            });
          } else {
            data.map(dataItem => this.totalColumnsSumMonth.push(dataItem));
            this.initMonthStatistics(this.totalColumnsSumMonth);
            this.totalMonthNumber = this.initPricing(this.totalColumnsSumMonth) * this.currencyMultiply;
          }
        });
    });
  }
  initLastMonths(): void {
    this.dashboardService.getSpendingHourDateBetween('8-1-2018', '8-31-2018', this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingHourDateBetween('8-1-2018', '8-31-2018', this.dashboardService.getRemoteUrl()).subscribe(dataRemote => {
              dataRemote.map(dataRemoteItem => { this.totalColumnsSumLastMonth.push(dataRemoteItem) });
              data.map((dataItem, index) => {
                if (this.totalColumnsSumLastMonth[index] === undefined) {
                  this.totalColumnsSumLastMonth.push(dataItem);
                } else {
                  this.totalColumnsSumLastMonth[index]['Total'] += dataItem['Total'];
                }
              });
              this.initLastMonthStatistics(this.totalColumnsSumLastMonth);
              this.totalLastMonthNumber = this.initPricing(this.totalColumnsSumLastMonth) * this.currencyMultiply;
              this.percentageCalcFunction();
            });
          } else {
            data.map(dataItem => this.totalColumnsSumLastMonth.push(dataItem));
            this.initLastMonthStatistics(this.totalColumnsSumLastMonth);
            this.totalLastMonthNumber = this.initPricing(this.totalColumnsSumLastMonth) * this.currencyMultiply;
            this.percentageCalcFunction();
          }
        });
    });
  }
  addDevice(selectName: string, Quantity: string, Spending: string, selectFloor: string): void {
    if (Quantity.trim() === "" || Spending.trim() === "") {
      if (localStorage.getItem("language-dashboard") === "en-dashboard") {
        this.toastService.show('Please enter required fields!', 3000);
      } else {
        this.toastService.show('Молимо вас унесите тражена поља!', 3000);
      }
    } else if (Quantity.match(/^[0-9]+$/) === null || Spending.match(/^[0-9]+$/) === null) {
      if (localStorage.getItem("language-dashboard") === "en-dashboard") {
        this.toastService.show('Input fields must be numbers only!', 3000);
      } else {
        this.toastService.show('Унета поља морају бити само бројеви!', 3000);
      }
    } else {
      if (selectFloor === "1st Floor" || selectFloor === "Први спрат") {
        this.firstFloor.push({ DeviceName: selectName, Floor: selectFloor, Quantity: parseInt(Quantity), Spent: parseInt(Spending) });
        this.initTotalForecast();
      } else if (selectFloor === "2nd Floor" || selectFloor === "Други спрат") {
        this.secondFloor.push({ DeviceName: selectName, Floor: selectFloor, Quantity: parseInt(Quantity), Spent: parseInt(Spending) });
        this.initTotalForecast();
      } else if (selectFloor === "Office" || selectFloor === "Канцеларија") {
        this.office.push({ DeviceName: selectName, Floor: selectFloor, Quantity: parseInt(Quantity), Spent: parseInt(Spending) });
        this.initTotalForecast();
      } else {
        this.basement.push({ DeviceName: selectName, Floor: selectFloor, Quantity: parseInt(Quantity), Spent: parseInt(Spending) });
        this.initTotalForecast();
      }
    }
  }
  initTabelarData(): void {
    this.dashboardService.getSpendingByLatestHour(this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingByLatestHour(this.dashboardService.getRemoteUrl()).subscribe(dataRemote => {
              this.basement.push(...dataRemote);
              this.populateFloorArr(data);
              this.basementCheck = true;
              this.selectLanguageArray();
            });
          } else {
            this.populateFloorArr(data);
            this.selectLanguageArray();
          }
        });
    });
  }
  initTotallySavedData(): void {
    this.dashboardService.getSpendingHourDateBetween('1-1-2016', '9-9-2018', this.dashboardService.getLocalUrl()).subscribe(data => {
      this.dashboardService.getTimeoutError()
        .subscribe(dataRemote => {
          if (!dataRemote) {
            this.dashboardService.getSpendingHourDateBetween('1-1-2016', '9-9-2018', this.dashboardService.getRemoteUrl()).subscribe(dataRemote => {
              dataRemote.map(dataRemoteItem => { this.totalColumnsSumTotally.push(dataRemoteItem) });
              data.map((dataItem, index) => {
                if (this.totalColumnsSumTotally[index] === undefined) {
                  this.totalColumnsSumTotally.push(dataItem);
                } else {
                  this.totalColumnsSumTotally[index]['Total'] += dataItem['Total'];
                }
              });
              this.initTotalDataYearly(this.totalColumnsSumTotally);
              this.spinner.hide();
            });
          } else {
            data.map(dataItem => this.totalColumnsSumTotally.push(dataItem));
            this.initTotalDataYearly(this.totalColumnsSumTotally);
            this.spinner.hide();
          }
        });
    });
  }
  initTotalDataYearly(data: any) {
    data.forEach(data => this.totalSpent.push(data['Total'] / 1000));
    this.totallySavedTillNow = (this.totalSpent.reduce((prev, next) => prev + next, 0) * 0.1).toFixed(2);
    this.savedMoney = ((Number(this.totallySavedTillNow) * this.currencyMultiply * 7)).toFixed(2);
  }
  populateFloorArr(data: any): void {
    data.map(dataItem => {
      if (dataItem.Floor === "1st Floor") {
        this.firstFloor.push(dataItem);
      } else if (dataItem.Floor === "2nd Floor") {
        this.secondFloor.push(dataItem);
      } else {
        this.office.push(dataItem);
      }
    });
  }
  initWeekStatistics(data: any): void {
    data.forEach(data => this.totalSpentWeek.push(data['Total'] / 1000));
    this.totalWeek = this.totalSpentWeek.reduce((prev, next) => prev + next, 0);
    this.totalForecastMonth = this.totalWeek + this.totalForecastWeek * 3;
  }
  initMonthStatistics(data: any): void {
    data.forEach(data => this.totalSpentMonth.push(data['Total'] / 1000));
    this.totalMonth = this.totalSpentMonth.reduce((prev, next) => prev + next, 0);
  }
  initLastMonthStatistics(data: any): void {
    data.forEach(data => this.totalSpentLastMonth.push(data['Total'] / 1000));
    this.totalLastMonth = this.totalSpentLastMonth.reduce((prev, next) => prev + next, 0);
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
  initPricing(data: any): number {
    this.highSpentArray = [];
    this.lowSpentArray = [];
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
    return highSpentFormat + lowSpentFormat;
  }
  initDataAfterLangChange(): void {
    this.totalColumnsSum = [];
    this.totalColumnsSumWeek = [];
    this.totalSpent = [];
    this.totalSpentWeek = [];
    this.totalColumnsSumMonth = [];
    this.totalSpentMonth = [];
    this.totalColumnsSumLastMonth = [];
    this.totalSpentLastMonth = [];
    this.highSpentArray = [];
    this.lowSpentArray = [];
    this.firstFloor = [];
    this.secondFloor = [];
    this.office = [];
    this.basement = [];
    this.totalColumnsSumTotally = [];
    this.initializeData();
  }
}
