import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoginDto } from '../../models/Auth';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';

@Component({
    selector: 'app-log-in',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './log-in.component.html',
})
export class LogInComponent {

    constructor(
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
        private readonly router: Router
    ) {}

    loginData: LoginDto = {
        email: "",
        password: ""
    };

    formSubmitted: boolean = false;
    loading: boolean = false;
    errorMessage?: string;

    showForgotPasswordForm: boolean = false;
    showConfirmForgotPasswordForm: boolean = false;
    resetEmail: string = "";
    confirmationCode: string = "";
    newPassword: string = "";
    confirmNewPasswordInput: string = "";

    async onSubmit(form: NgForm): Promise<void> {
        this.formSubmitted = true;
        this.errorMessage = undefined;

        if (form.invalid) {
            return;
        }

        this.loading = true;
        try {
            await this.authService.login(this.loginData.email, this.loginData.password);
            this.toastService.addToast({ title: "Success", details: "Login successful!", type: ToastType.SUCCESS });
            this.router.navigate(["/"]);
        } catch (error: any) {
            this.toastService.addToast({ title: "Error", details: "An error occurred logging in. Please try again later.", type: ToastType.ERROR });
            console.error("Login error:", error);
            this.errorMessage = error.message || "Invalid email or password.";
        } finally {
            this.loading = false;
        }
    }
    
    hasBeenSubmitted(): boolean {
        return this.formSubmitted;
    }

    onForgotPasswordClick(): void {
        this.showForgotPasswordForm = true;
        this.showConfirmForgotPasswordForm = false;
        this.errorMessage = undefined;
        this.resetEmail = "";
        this.loading = false;
    }
    
    async onResetPasswordSubmit(form: NgForm): Promise<void> {
        this.formSubmitted = true;
        this.errorMessage = undefined;

        if (form.invalid) {
            return;
        }

        this.loading = true;
        try {
            await this.authService.forgotPassword(this.resetEmail);
            this.toastService.addToast({ title: "Success", details: "Verification code sent to your email.", type: ToastType.SUCCESS });
            this.showForgotPasswordForm = false;
            this.showConfirmForgotPasswordForm = true;
            this.formSubmitted = false;
        } catch (error: any) {
            this.toastService.addToast({ title: "Error", details: "Failed to send verification code. Please check your email.", type: ToastType.ERROR });
            console.error("Forgot password error:", error);
            this.errorMessage = error.message || "Could not send reset code.";
        } finally {
            this.loading = false;
        }
    }

    async onConfirmResetPasswordSubmit(form: NgForm): Promise<void> {
        this.formSubmitted = true;
        this.errorMessage = undefined;

        if (form.invalid) {
            return;
        }

        if (this.newPassword !== this.confirmNewPasswordInput) {
            this.errorMessage = "Passwords do not match.";
            return;
        }

        this.loading = true;
        try {
            await this.authService.confirmNewPassword(this.resetEmail, this.confirmationCode, this.newPassword);
            this.toastService.addToast({ title: "Success", details: "Password reset successfully! You can now log in with your new password.", type: ToastType.SUCCESS });
            this.showForgotPasswordForm = false;
            this.showConfirmForgotPasswordForm = false;
            this.resetEmail = "";
            this.confirmationCode = "";
            this.newPassword = "";
            this.confirmNewPasswordInput = "";
            this.formSubmitted = false;
        } catch (error: any) {
            this.toastService.addToast({ title: "Error", details: "Failed to reset password. Please check the code and try again.", type: ToastType.ERROR });
            console.error("Confirm password reset error:", error);
            this.errorMessage = error.message || "Could not reset password.";
        } finally {
            this.loading = false;
        }
    }

    backToLogin(): void {
        this.showForgotPasswordForm = false;
        this.showConfirmForgotPasswordForm = false;
        this.errorMessage = undefined;
        this.formSubmitted = false;
        this.loading = false;
        this.resetEmail = "";
        this.confirmationCode = "";
        this.newPassword = "";
        this.confirmNewPasswordInput = "";
    }
}
