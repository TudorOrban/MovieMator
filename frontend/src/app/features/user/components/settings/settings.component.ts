import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatsTimePeriodOption, UpdateUserDto, UserDataDto, UserSettings } from '../../models/User';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FontAwesomeModule
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {
    currentUser: UserDataDto | null = null;
    isEditModeOn: boolean = false;
    isLoading: boolean = true;
    isSaving: boolean = false;

    settingsForm: FormGroup;
    private initialSettings: UserSettings | null = null;

    subscription: Subscription = new Subscription();

    sortByOptions = [
        { label: "Created At", value: "createdAt" },
        { label: "Last Modified", value: "updatedAt" },
        { label: "Title (A-Z)", value: "title" },
        { label: "Director", value: "director" },
        { label: "Runtime", value: "runtimeMinutes" },
        { label: "Watched Date", value: "watchedDate" },
        { label: "Rating", value: "userRating" },
        { label: "Release Year", value: "releaseYear" },
    ];

    moviesPerRowOptions = [
        { label: "1 Movie", value: 1 },
        { label: "2 Movies", value: 2 },
        { label: "3 Movies", value: 3 },
        { label: "4 Movies", value: 4 },
        { label: "5 Movies", value: 5 },
    ];

    statsTimePeriodOptions = [
        { label: "One Year", value: StatsTimePeriodOption.LAST_YEAR },
        { label: "Three Months", value: StatsTimePeriodOption.LAST_3_MONTHS },
        { label: "One Month", value: StatsTimePeriodOption.LAST_MONTH },
    ];

    appThemeOptions = [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
    ];

    constructor(
        private readonly authService: AuthService,
        private readonly fb: FormBuilder,
        private readonly userService: UserService,
        private readonly toastService: ToastManagerService,
    ) {
        this.settingsForm = this.fb.group({
            appTheme: ["light", Validators.required],
            confirmDeletions: [true],
            defaultMovieSortBy: ["watchedDate", Validators.required], 
            moviesPerRow: [3, [Validators.required, Validators.min(1)]],
            defaultStatsTimePeriod: [StatsTimePeriodOption.LAST_YEAR, Validators.required],
        });
    }

    ngOnInit(): void {
        this.subscription.add(this.authService.currentUser$.subscribe({
            next: (user) => {
                this.currentUser = user;
                if (user?.id && user?.userSettings) {
                    this.settingsForm.patchValue(user.userSettings);
                    this.initialSettings = { ...user.userSettings };
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error("Error fetching current user:", err);
                this.isLoading = false;
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmit(): void {
        if (!this.currentUser) return;
        if (this.settingsForm.invalid) {
            this.toastService.addToast({
                title: "Validation Error",
                details: "Please correct the form errors.",
                type: ToastType.ERROR
            });
            this.settingsForm.markAllAsTouched();
            return;
        }

        this.isSaving = true;
        const updatedSettings: UserSettings = this.settingsForm.value;
        const updatedUser: UpdateUserDto = {
            id: this.currentUser.id,
            displayName: this.currentUser.displayName,
            userSettings: updatedSettings,
            isProfilePublic: this.currentUser.isProfilePublic
        };

        this.userService.updateUser(updatedUser).pipe(
            finalize(() => this.isSaving = false)
        ).subscribe({
            next: (updatedUser: UserDataDto) => {
                this.initialSettings = { ...updatedUser.userSettings };
                this.authService.setCurrentUser(updatedUser); 
                this.toastService.addToast({
                    title: "Success",
                    details: "Settings saved successfully!",
                    type: ToastType.SUCCESS
                });
            },
            error: (error) => {
                console.error("Error saving user settings:", error);
                this.toastService.addToast({
                    title: "Error",
                    details: "Failed to save settings.",
                    type: ToastType.ERROR
                });
            }
        });
    }

    onCancel(): void {
        if (this.initialSettings) {
            this.settingsForm.patchValue(this.initialSettings);
            this.toastService.addToast({
                title: "Cancelled",
                details: "Changes have been discarded.",
                type: ToastType.INFO
            });
        } else {
            this.settingsForm.reset(this.settingsForm.value);
            this.toastService.addToast({
                title: "Info",
                details: "No changes to discard or initial settings not loaded.",
                type: ToastType.INFO
            });
        }
    }

    hasChanges(): boolean {
        return !this.settingsForm.pristine && !this.settingsForm.pending;
    }

    faSave = faSave;
    faTimes = faTimes;
}