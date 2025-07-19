import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.isAuthCheckComplete$.pipe(
            filter(isComplete => isComplete),
            take(1),
            switchMap(() => this.authService.currentUser$.pipe(take(1))),
            map(user => {
                if (user) {
                    return true;
                } else {
                    console.error("AuthGuard: Access denied. User not authenticated. Redirecting to login.");
                    return this.router.createUrlTree(["/login"]);
                }
            })
        );
    }
}