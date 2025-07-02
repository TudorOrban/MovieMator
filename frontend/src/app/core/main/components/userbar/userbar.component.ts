import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../auth/service/auth.service';
import { UserDataDto } from '../../../auth/models/User';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-userbar',
    imports: [CommonModule, FontAwesomeModule, RouterModule],
    templateUrl: './userbar.component.html',
})
export class UserbarComponent implements OnInit, OnDestroy {
    isExpanded: boolean = false;
    currentUser: UserDataDto | null = null;

    private subscription: Subscription = new Subscription();
    
    constructor(
        readonly authService: AuthService
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

    logOut(): void {
        this.authService.logout();
    }

    faUser = faUser;
}
