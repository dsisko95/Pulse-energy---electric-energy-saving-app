import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from "../landing-page/login/login.component";
import { CantFindComponent } from "../cant-find/cant-find.component";
import { LandingPageComponent } from "../landing-page/landing-page.component";
import { DashboardComponentOverview } from "../landing-page/login/dashboard/dashboard-overview/dashboard-overview.component";
import { AuthGuard } from "../auth-guard.service";
import { DashboardComponent } from "../landing-page/login/dashboard/dashboard.component";
import { DashboardAdvancedComponent } from "../landing-page/login/dashboard/dashboard-range/dashboard-range.component";
import { DashboardSavingsComponent } from "../landing-page/login/dashboard/dashboard-savings/dashboard-savings.component";
import { DashboardDemoComponent } from "../landing-page/dashboard-demo/dashboard-demo.component";

const routes: Routes = [
    {  path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'demo', component: DashboardDemoComponent },
    {
        path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent, children: [
            { path: 'overview', component: DashboardComponentOverview },
            { path: 'advanced', component: DashboardAdvancedComponent },
            { path: 'savings', component: DashboardSavingsComponent }
        ]
    },
    { path: '404-page', component: CantFindComponent },
    { path: '**', redirectTo: '/404-page' }
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule {

}