import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { UserbarComponent } from "../userbar/userbar.component";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule, UserbarComponent],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.subscription = this.authService.isAuthenticated$.subscribe({
            next: (data) => {
                this.isLoggedIn = data;
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
