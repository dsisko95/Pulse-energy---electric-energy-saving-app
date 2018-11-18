import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { LoginService } from "./login.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.loginService.checkIfUserIsLogged()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
    // canActivateChild(route: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //     return this.canActivate(route, state);
    // }
}