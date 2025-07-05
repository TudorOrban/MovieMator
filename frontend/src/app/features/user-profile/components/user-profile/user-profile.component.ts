import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { Subscription } from 'rxjs';
import { UserDataDto } from '../../../../core/auth/models/User';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-user-profile',
    imports: [CommonModule, RouterModule],
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit, OnDestroy {
    currentUser: UserDataDto | null = null;
    isEditModeOn: boolean = false;

    subscription: Subscription = new Subscription();

    constructor(
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (data) => {
                this.currentUser = data;
            },
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}