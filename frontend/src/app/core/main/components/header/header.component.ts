import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
    isLoggedIn: boolean = false;

    constructor(
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.authService.isAuthenticated$.subscribe({
            next: (data) => {
                this.isLoggedIn = data.isAuthenticated;
            }
        });
    }

    logOut(): void {
        this.authService.logout();
    }
}
