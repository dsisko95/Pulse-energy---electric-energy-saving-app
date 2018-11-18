import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AppComponent } from './app.component';
import { MaterializeModule } from './feature-modules/materialize-module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { NgxSpinnerModule } from 'ngx-spinner';

import { LoginComponent } from './landing-page/login/login.component';
import { CantFindComponent } from './cant-find/cant-find.component';
import { RoutingModule } from './feature-modules/routing-module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponentOverview } from './landing-page/login/dashboard/dashboard-overview/dashboard-overview.component';
import { AuthGuard } from './auth-guard.service';
import { LoginService } from './login.service';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './landing-page/login/dashboard/dashboard.component';
import { DashboardAdvancedComponent } from './landing-page/login/dashboard/dashboard-range/dashboard-range.component';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { DashboardSavingsComponent } from './landing-page/login/dashboard/dashboard-savings/dashboard-savings.component';
import { DashboardDemoComponent } from './landing-page/dashboard-demo/dashboard-demo.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CantFindComponent,
    LandingPageComponent,
    DashboardComponentOverview,
    DashboardComponent,
    DashboardAdvancedComponent,
    ModalComponentComponent,
    DashboardSavingsComponent,
    DashboardDemoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterializeModule,
    RoutingModule,
    HttpClientModule,
    NgProgressModule,
    NgxSpinnerModule,
    ScrollToModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }, AuthGuard, LoginService, DashboardService],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponentComponent]
})
export class AppModule { }
