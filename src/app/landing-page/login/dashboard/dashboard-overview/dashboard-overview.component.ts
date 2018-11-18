import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../../dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MzToastService } from 'ngx-materialize';
import { Chart } from 'chart.js';
import { saveAs } from 'file-saver';
import 'chartjs-plugin-datalabels';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard-overview.component.html',
    styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardComponentOverview implements OnInit, OnDestroy {
    languageSubscription: Subscription;
    currencySubscription: Subscription;
    percentageSubscription: Subscription;
    floorSubscription: Subscription;
    maxDevicesSubscription: Subscription;
    mainSubscription: Subscription;
    currencyPrefix: string;
    totalDataPercentage: number;
    currencyMultiply: number;
    maxTotal: number;
    minTotal: number;
    spentCurrency: number;
    langChanged: string;
    maxSpentDevice: string;
    minSpentDevice: string;
    total: number;
    highSpentCharge: number;
    lowSpentCharge: number;
    euroCurrency: number = 0.00845700;
    highSpentTarriff: number = 6;
    lowSpentTariff: number = 1.5;
    date: string = "9-9-2018";
    kwValue: string;
    firstFloor: string;
    secondFloor: string;
    basement: string;
    Office: string;
    spendingPerHour: string;
    dateReverse: string;
    percentageUsage: string;
    co2Emmision: number;
    co2EmmisionHour: string;
    highSpent: number;
    lowSpent: number;
    valuePerCurrency: string;
    lowSpentPercentage: string;
    chart = [];
    chartFloor = [];
    lowSpentArray = [];
    highSpentArray = [];
    totalSpent = [];
    maxSpentDevicesBeforeNoon = [];
    maxSpentDevicesAfterNoon = [];
    chartArea = [];
    totalColumnsSum = [];
    public dateOfDay = this.date;
    public options: Pickadate.DateOptions = {
        format: 'dddd, dd mmm, yyyy',
        formatSubmit: 'm-d-yyyy',
        min: new Date(2016, 0, 1),
        max: new Date(2018, 8, 9),
        selectMonths: true,
        selectYears: true
    };
    constructor(
        private dashboardService: DashboardService,
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
        this.initializeData(this.date);
    }
    ngOnDestroy() {
        this.languageSubscription.unsubscribe();
        this.currencySubscription.unsubscribe();
        this.percentageSubscription.unsubscribe();
        this.floorSubscription.unsubscribe();
        this.maxDevicesSubscription.unsubscribe();
        this.mainSubscription.unsubscribe();
    }
    initializeData(date: string): void {
        this.spinner.show();
        this.mainSubscription = this.dashboardService.getSpendingHourDate(date, this.dashboardService.getLocalUrl()).subscribe(data => {
            this.initDataRemote(data, date);
        });
    }
    initDataRemote(data: any, date: string) {
        this.dashboardService.getTimeoutError()
            .subscribe(dataRemote => {
                if (!dataRemote) {
                    this.dashboardService.getTestServer()
                        .subscribe(dataTest => {
                            if (dataTest) {
                                this.dashboardService.getSpendingHourDate(date, this.dashboardService.getRemoteUrl()).subscribe(dataRemote => {
                                    if (dataRemote !== null) {
                                        dataRemote.map(dataRemoteItem => { this.totalColumnsSum.push(dataRemoteItem) });
                                        data.map((dataItem, index) => this.totalColumnsSum[index].Total += dataItem['Total']);
                                    } else {
                                        data.map(dataItem => this.totalColumnsSum.push(dataItem));
                                    }
                                    this.initStatistics(this.totalColumnsSum, date);
                                });
                            }
                        })
                } else {
                    data.map(dataItem => this.totalColumnsSum.push(dataItem));
                    this.initStatistics(this.totalColumnsSum, date);
                }
            });
    }
    initStatistics(data: any, date: string): void {
        let totalColumns = data.map(data => data['Total'] / 1000);
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
        this.valuePerCurrency = `${((highSpentFormat + lowSpentFormat) / (highSpent + lowSpent)).toFixed(2)} ${this.currencyPrefix}`;
        this.highSpentCharge = highSpent.toFixed(2);
        this.lowSpentCharge = lowSpent.toFixed(2);
        this.spendingPerHour = ((highSpent + lowSpent) / 24).toFixed(2);
        this.lowSpentPercentage = `${(lowSpentFormat / (lowSpentFormat + highSpentFormat) * 100).toFixed(0)}% `;
        this.highSpent = Number(highSpentFormat.toFixed(0));
        this.lowSpent = Number(lowSpentFormat.toFixed(0));
        this.spentCurrency = (Number(highSpentFormat.toFixed(0)) + Number(lowSpentFormat.toFixed(0)));
        this.kwValue = (this.total).toFixed(2);
        this.co2Emmision = Number((this.total * 0.60).toFixed(0));
        this.co2EmmisionHour = ((this.total * 0.60) / 24).toFixed(0);
        this.percentageCalculator(date);
        this.getSpendingByFloor(date);
        this.getMaxSpendingByDevices(date);
        this.initializeLineChart(totalColumns);
    }
    percentageCalculator(date: string): void {
        this.percentageSubscription = this.dashboardService.getSpendingSevenDaysAgo(date, this.dashboardService.getLocalUrl()).subscribe(data => {
            this.dashboardService.getTimeoutError()
                .subscribe(dataRemote => {
                    if (!dataRemote) {
                        this.dashboardService.getSpendingSevenDaysAgo(date, this.dashboardService.getRemoteUrl())
                            .subscribe(dataRemote => {
                                this.totalDataPercentage = data['Total'];
                                this.totalDataPercentage += dataRemote['Total'];
                                this.percentageCalcFunction(this.totalDataPercentage, data);
                            })
                    } else {
                        this.totalDataPercentage = data['Total'];
                        this.percentageCalcFunction(this.totalDataPercentage, data);
                    }
                });
        });
    }
    percentageCalcFunction(dataTotal: number, data: any): void {
        this.dateReverse = data['DateLog'];
        if (this.total > dataTotal / 1000) {
            let calculation = (this.total / (dataTotal / 1000)).toFixed(2);
            if (!isFinite(+calculation)) {
                if (this.langChanged === "en-dashboard") {
                    this.percentageUsage = "No data entry for the past 7 days";
                } else {
                    this.percentageUsage = "Нема евиденције пре 7 дана";
                }
                this.dateReverse = "";
            } else {
                if (this.langChanged === "en-dashboard") {
                    this.percentageUsage = `${calculation} times more than `;
                } else {
                    this.percentageUsage = `${calculation} пута више него `;
                }
            }
        } else {
            let calculation = (100 - (this.total / (dataTotal / 1000)) * 100).toFixed(2);
            if (!isFinite(+calculation)) {
                if (this.langChanged === "en-dashboard") {
                    this.percentageUsage = "No data entry for the past 7 days";
                } else {
                    this.percentageUsage = "Нема евиденције пре 7 дана";
                }
                this.dateReverse = "";
            } else {
                if (this.langChanged === "en-dashboard") {
                    this.percentageUsage = `${calculation}% less than `;
                } else {
                    this.percentageUsage = `${calculation}% мање него `;
                }
            }
        }
        this.spinner.hide();
    }
    getSpendingByFloor(date: string): void {
        this.floorSubscription = this.dashboardService.getSpendingByFloor(date, this.dashboardService.getLocalUrl()).subscribe(data => {
            this.dashboardService.getTimeoutError()
                .subscribe(dataRemote => {
                    if (!dataRemote) {
                        this.dashboardService.getSpendingByFloor(date, this.dashboardService.getRemoteUrl())
                            .subscribe(dataRemote => {
                                if (dataRemote !== null) {
                                    let totalColumns = data.map(data => data['Total'] / 1000);
                                    totalColumns.push(dataRemote[0]["Total"] / 1000);
                                    this.initSpendingByFloor(totalColumns, data);
                                } else {
                                    let totalColumns = data.map(data => data['Total'] / 1000);
                                    this.initSpendingByFloor(totalColumns, data);
                                }
                            })
                    } else {
                        let totalColumns = data.map(data => data['Total'] / 1000);
                        this.initSpendingByFloor(totalColumns, data);
                    }
                });
        });
    }
    initSpendingByFloor(totalColumns: any, data: any) {
        let sumOfColumns = totalColumns.reduce((prev, next) => prev + next, 0);
        data.map(dataItem => {
            if (dataItem["Floor"] === "1st Floor") {
                this.firstFloor = ((dataItem["Total"] / 1000 / sumOfColumns) * 100).toFixed(2);
            } else if (dataItem["Floor"] === "2nd Floor") {
                this.secondFloor = ((dataItem["Total"] / 1000 / sumOfColumns) * 100).toFixed(2);
            } else if (dataItem["Floor"] === "Office") {
                this.Office = ((dataItem["Total"] / 1000 / sumOfColumns) * 100).toFixed(2);
            }
        });
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
    }
    getMaxSpendingByDevices(date: string): void {
        let maxArray = [];
        this.maxDevicesSubscription = this.dashboardService.getMaxSpendingByDevices(date, this.dashboardService.getLocalUrl()).subscribe(data => {
            this.dashboardService.getTimeoutError()
                .subscribe(dataRemote => {
                    if (!dataRemote) {
                        this.dashboardService.getMaxSpendingByDevices(date, this.dashboardService.getRemoteUrl())
                            .subscribe(dataRemote => {
                                if (dataRemote !== null) {
                                    dataRemote.map((dataRemoteItem, index) => {
                                        if (dataRemote[index].Total > data[index].Total) {
                                            maxArray.push(dataRemote[index]);
                                        } else {
                                            maxArray.push(data[index]);
                                        }
                                    });
                                    this.calcMaxSpending(maxArray);
                                } else {
                                    this.calcMaxSpending(data);
                                }
                            })
                    } else {
                        this.calcMaxSpending(data);
                    }
                });
        });
    }
    calcMaxSpending(data: any) {
        data.map((device) => {
            if (device["Hour"] >= 1 && device["Hour"] <= 12) {
                this.maxSpentDevicesBeforeNoon.push(device);
            } else {
                this.maxSpentDevicesAfterNoon.push(device);
            }
        });
        this.maxSpentDevicesAfterNoon.splice(0, 1);
        this.maxSpentDevicesAfterNoon.push(data[0]);
        let totalArray = data.map(data => data["Total"]);
        let maxTotal = Math.max(...totalArray);
        let minTotal = Math.min(...totalArray);
        let maxDevice = data.filter(data => data["Total"] === maxTotal);
        let minDevice = data.filter(data => data["Total"] === minTotal);
        this.maxTotal = maxTotal / 1000;
        this.minTotal = minTotal / 1000;
        this.maxSpentDevice = maxDevice[0].DeviceName;
        this.minSpentDevice = minDevice[0].DeviceName;
        let totalColumns = data.map(data => {
            return data['Total'] / 1000;
        });
        this.initializeBarChart(totalColumns);
    }
    initializeLineChart(data: any): void {
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
                labels: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                datasets: [
                    {
                        label: "kW/h",
                        data: data,
                        borderColor: '#2196f3',
                        fill: false,
                        lineTension: 0
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
                            labelString: 'Hour'
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
    initializePie(data: any): void {
        this.chartFloor = new Chart('canvasFloor', {
            type: 'doughnut',
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
    initializeBarChart(data: any): void {
        this.chartArea = new Chart('canvasArea', {
            type: 'bar',
            data: {
                labels: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                datasets: [
                    {
                        label: "kW/h",
                        data: data,
                        backgroundColor: '#64b5f6',
                        borderColor: "transparent",
                        borderWidth: 4
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
                            display: true
                        },
                        ticks: {
                            autoSkip: true
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'kW/h'
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
    changeDate(dateOfDay: string): void {
        if (dateOfDay === "") {
            if (localStorage.getItem("language-dashboard") === "en-dashboard") {
                this.toastService.show('Please choose a date!', 3000);
            } else {
                this.toastService.show('Молимо вас одаберите датум!', 3000);
            }
        } else {
            this.totalSpent = [];
            this.highSpentArray = [];
            this.lowSpentArray = [];
            this.maxSpentDevicesBeforeNoon = [];
            this.maxSpentDevicesAfterNoon = [];
            this.totalColumnsSum = [];
            (<Chart>this.chart).destroy();
            (<Chart>this.chartFloor).destroy();
            (<Chart>this.chartArea).destroy();
            this.date = dateOfDay;
            this.initializeData(this.date);
        }
    }
    initDataAfterLangChange(): void {
        this.totalSpent = [];
        this.highSpentArray = [];
        this.lowSpentArray = [];
        this.maxSpentDevicesBeforeNoon = [];
        this.maxSpentDevicesAfterNoon = [];
        this.totalColumnsSum = [];
        (<Chart>this.chart).destroy();
        (<Chart>this.chartFloor).destroy();
        (<Chart>this.chartArea).destroy();
        this.initializeData(this.date);
    }
    saveChart(): void {
        (<Chart>this.chart).options.plugins.datalabels.display = true;
        (<Chart>this.chart).update();
        setTimeout(() => {
            (<Chart>document.getElementById('canvas')).toBlob(function (blob) {
                saveAs(blob, "top-spending.png")
            });
        }, 1)
        setTimeout(() => {
            (<Chart>this.chart).options.plugins.datalabels.display = false;
            (<Chart>this.chart).update();
        }, 1);
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
    saveMaxDevice(): void {
        (<Chart>this.chartArea).options.plugins.datalabels.display = true;
        (<Chart>this.chartArea).update();
        setTimeout(() => {
            (<Chart>document.getElementById('canvasArea')).toBlob(function (blob) {
                saveAs(blob, "max-device.png")
            });
        }, 1)
        setTimeout(() => {
            (<Chart>this.chartArea).options.plugins.datalabels.display = false;
            (<Chart>this.chartArea).update();
        }, 1);
    }
}
