import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { Router, RouterModule } from '@angular/router';
import { UpdateUserDto } from '../../models/User';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ToastType } from '../../../../shared/models/UI';
import { SwitchComponent } from '../../../../shared/common/components/switch/switch.component';
import { PublicProfileConsentComponent } from "./public-profile-consent/public-profile-consent.component";

@Component({
    selector: 'app-edit-profile',
    imports: [CommonModule, FormsModule, RouterModule, SwitchComponent, PublicProfileConsentComponent],
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit, OnDestroy {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly toastService: ToastManagerService,
        private readonly router: Router
    ) {}

    editProfileData: UpdateUserDto = {
        id: -1,
        displayName: "",
        isProfilePublic: false,
        contactInfo: ""
    };

    originalIsProfilePublic: boolean = false;
    showPublicProfileConsentModal: boolean = false;

    formSubmitted: boolean = false;
    loading: boolean = false;
    errorMessage?: string;

    private subscription: Subscription = new Subscription();

    ngOnInit() {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }
                this.editProfileData.id = data.id;
                this.editProfileData.displayName = data.displayName;
                this.editProfileData.userSettings = data.userSettings;
                this.editProfileData.isProfilePublic = data.isProfilePublic ?? false;
                this.editProfileData.contactInfo = data.contactInfo;

                this.originalIsProfilePublic = this.editProfileData.isProfilePublic;
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
            }
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async onSubmit(form: NgForm): Promise<void> {
        this.formSubmitted = true;
        this.errorMessage = undefined;

        if (form.invalid) {
            return;
        }

        if (!this.originalIsProfilePublic && this.editProfileData.isProfilePublic) {
            this.showPublicProfileConsentModal = true;
            return;
        }

        this.performUpdate();
    }

    onConsentConfirmed(): void {
        this.showPublicProfileConsentModal = false;
        this.performUpdate();
    }

    onConsentCancelled(): void {
        this.showPublicProfileConsentModal = false;
        this.editProfileData.isProfilePublic = false;
    }

    private performUpdate(): void {
        this.loading = true;

        this.userService.updateUser(this.editProfileData).subscribe({
            next: (data) => {
                this.toastService.addToast({ title: "Success", details: "Profile edited successfully.", type: ToastType.SUCCESS });
                this.authService.setCurrentUser(data);
                this.originalIsProfilePublic = this.editProfileData.isProfilePublic;
                this.router.navigate(["/user-profile/" + data?.id]);
            },
            error: (error) => {
                this.toastService.addToast({ title: "Error", details: "An error occurred editing the profile. Please try again later.", type: ToastType.ERROR });
                console.error("Profile update error:", error);
                this.errorMessage = error.message || "An unexpected error occurred.";
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    hasBeenSubmitted(): boolean {
        return this.formSubmitted;
    }
}
