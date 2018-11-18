import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private langChanged = new Subject<string>();
  private currencyChanged = new Subject<string>();
  private timeOutError = new BehaviorSubject(true);
  private setCompany: Object;
  private url: string = "http://localhost:63236/api/dashboard";
  private remoteUrl: string = "http://192.168.1.10:45455/api/dashboard";
  constructor(private http: HttpClient) {

  }
  updateLanguage(id: number, language: string): Observable<Object> {
    return this.http.put(`${this.url}/updateUserLanguage`,
      {
        "Id": `${id}`,
        "Language": `${language}`,
      }
    )
  }
  updateCurrency(id: number, currency: string): Observable<Object> {
    return this.http.put(`${this.url}/updateUserCurrency`,
      {
        "Id": `${id}`,
        "Currency": `${currency}`,
      }
    )
  }
  getTestServer(): Observable<any> {
    return this.http.get<any>(`${this.remoteUrl}/getTestServer`);
  }
  getSpendingHourDate(date: string, url: string): Observable<any> {
    return this.http.get<any>(`${url}/${date}/getSpendingHourDate`);
  }
  getSpendingHourDateBetween(minDate: string, maxDate: string, url: string): Observable<any> {
    return this.http.get<any>(`${url}/${minDate}/${maxDate}/getSpendingHourDateBetween`);
  }
  getSpendingSevenDaysAgo(date: string, url: string): Observable<Object> {
    return this.http.get<Object>(`${url}/${date}/getSpendingSevenDaysAgo`);
  }
  getSpendingByFloor(date: string, url: string): Observable<any> {
    return this.http.get<any>(`${url}/${date}/getSpendingByFloor`);
  }
  getSpendingByFloorBetween(minDate: string, maxDate: string, url: string): Observable<any> {
    return this.http.get<any>(`${url}/${minDate}/${maxDate}/getSpendingByFloorBetween`);
  }
  getMaxSpendingByDevices(date: string, url: string): Observable<any> {
    return this.http.get<any>(`${url}/${date}/getMaxSpendingByDevices`);
  }
  getSpendingByMonthlyYears(url: string): Observable<any> {
    return this.http.get<any>(`${url}/getSpendingByMonthlyYears`);
  }
  getSpendingByYears(url: string): Observable<any> {
    return this.http.get<any>(`${url}/getSpendingByYears`);
  }
  getSpendingHour23(date: string, url: string): Observable<any> {
    return this.http.get<any>(`${url}/${date}/getSpendingHour23`);
  }
  getSpendingByLatestHour(url: string): Observable<any> {
    return this.http.get<any>(`${url}/getSpendingByLatestHour`);
  }
  sendLoginObject(data: Object) {
    this.setCompany = data;
  }
  getLoginObject(): Object {
    return this.setCompany;
  }
  detectLangChange(data: string): void {
    this.langChanged.next(data);
  }
  getLangChange(): Observable<string> {
    return this.langChanged.asObservable();
  }
  detectCurrencyChange(data: string): void {
    this.currencyChanged.next(data);
  }
  getCurrencyChange(): Observable<string> {
    return this.currencyChanged.asObservable();
  }
  getLocalUrl(): string {
    return this.url;
  }
  getRemoteUrl(): string {
    return this.remoteUrl;
  }
  setTimeoutError(data: boolean): void {
    this.timeOutError.next(data);
  }
  getTimeoutError(): Observable<boolean> {
    return this.timeOutError.asObservable();
  }
}
