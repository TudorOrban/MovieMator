import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDataDto } from '../../models/User';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-change-password',
    imports: [CommonModule, FormsModule],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    currentUser: UserDataDto | null = null;

    currentPassword: string = "";
    newPassword: string = "";
    confirmNewPassword: string = "";

    formSubmitted: boolean = false;
    loading: boolean = false;
    errorMessage?: string;
    successMessage?: string;

    subscription: Subscription = new Subscription();

    constructor(
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
        private readonly router: Router 
    ) {}

    ngOnInit(): void {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (user) => {
                this.currentUser = user;
            },
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async onSubmit(form: NgForm): Promise<void> {
        this.formSubmitted = true;
        this.errorMessage = undefined;
        this.successMessage = undefined;

        if (form.invalid) {
            return;
        }

        if (this.newPassword !== this.confirmNewPassword) {
            this.errorMessage = "New passwords do not match.";
            return;
        }

        this.loading = true;
        try {
            await this.authService.changeUserPassword(this.currentPassword, this.newPassword);
            this.toastService.addToast({ title: "Success", details: "Password changed successfully!", type: ToastType.SUCCESS });
            this.successMessage = "Your password has been changed successfully.";
            this.currentPassword = "";
            this.newPassword = "";
            this.confirmNewPassword = "";
            this.formSubmitted = false;
            this.router.navigate(["/"]);
        } catch (error: any) {
            this.toastService.addToast({ title: "Error", details: "Failed to change password. Please check your current password.", type: ToastType.ERROR });
            console.error("Change password error:", error);
            this.errorMessage = error.message || "An error occurred while changing password.";
        } finally {
            this.loading = false;
        }
    }

    hasBeenSubmitted(): boolean {
        return this.formSubmitted;
    }
}
