import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../auth/service/auth.service';
import { UserDataDto } from '../../../../features/user/models/User';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../../shared/common/services/theme.service';

@Component({
    selector: 'app-userbar',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './userbar.component.html',
})
export class UserbarComponent implements OnInit, OnDestroy {
    isExpanded: boolean = false;
    currentUser: UserDataDto | null = null;

    private subscription: Subscription = new Subscription();
    
    constructor(
        readonly authService: AuthService,
        readonly themeService: ThemeService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (data) => {
                this.currentUser = data;
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
            }
        });
    }
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    toggleExpanded(): void {
        this.isExpanded = !this.isExpanded;
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }

    navigateTo(path: string): void {
        this.isExpanded = false;
        this.router.navigate([path]);
    }

    logOut(): void {
        this.authService.logout();
    }

    faUser = faUser;
    faMoon = faMoon;
}
