import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { SignUpDto } from '../../models/Auth';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';

@Component({
    selector: 'app-sign-up',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
    
    constructor(
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
        private readonly router: Router
    ) {}

    signUpData: SignUpDto = {
        email: "",
        password: "",
        confirmPassword: ""
    };
    confirmationCode: string = "";

    formSubmitted: boolean = false;
    showConfirmationForm: boolean = false;
    loading: boolean = false;
    errorMessage?: string;
    successMessage?: string;

    async onSubmit(form: NgForm): Promise<void> {
        this.formSubmitted = true;
        this.errorMessage = undefined;
        this.successMessage = undefined;

        if (form.invalid) return;
        if (this.signUpData.password !== this.signUpData.confirmPassword) {
            this.errorMessage = "Passwords do not match.";
            return;
        }

        this.loading = true;
        try {
            await this.authService.signUp(this.signUpData.email, this.signUpData.password);
            this.showConfirmationForm = true;
            this.successMessage = `A confirmation code has been sent to ${this.signUpData.email}. Please check your inbox.`
        } catch (error: any) {
            console.error("Signup error:", error);
            this.errorMessage = error.message || "An unexpected error occurred during signup";
        } finally {
            this.loading = false;
        }
    }

    async onConfirmSignUp(form: NgForm): Promise<void> {
        this.formSubmitted = true;
        this.errorMessage = undefined;
        this.successMessage = undefined;

        if (form.invalid) {
            return;
        }

        this.loading = true;
        try {
            await this.authService.confirmSignUp(this.signUpData.email, this.confirmationCode);
            this.successMessage = "Account confirmed successfully! You can now log in.";
            this.signUpData.email = "";
            this.signUpData.password = "";
            this.signUpData.confirmPassword = "";
            this.confirmationCode = "";
            this.toastService.addToast({ title: "Success", details: "Sign Up successful!", type: ToastType.SUCCESS });
            this.router.navigate(["/login"]);
        } catch (error: any) {
            this.toastService.addToast({ title: "Error", details: "An error occurred signing up. Please try again later.", type: ToastType.ERROR });
            console.error("Confirm signup error:", error);
            this.errorMessage = error.message || "An unexpected error occurred during confirmation.";
        } finally {
            this.loading = false;
        }
    }

    hasBeenSubmitted(): boolean {
        return this.formSubmitted;
    }

    passwordMatchValidator(): boolean {
        return this.signUpData.password === this.signUpData.confirmPassword;
    }
}
