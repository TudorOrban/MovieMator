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
}
