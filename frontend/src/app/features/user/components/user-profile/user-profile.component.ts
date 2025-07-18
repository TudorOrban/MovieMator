import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { Subscription } from 'rxjs';
import { UserDataDto } from '../../models/User';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../../movies/services/movie.service';
import { ThemeService } from '../../../../shared/common/services/theme.service';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-user-profile',
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit, OnDestroy {
    profileId: number | null = null;
    profileUser: UserDataDto | null = null;
    currentUser: UserDataDto | null = null;
    isEditModeOn: boolean = false;
    currentTheme: string = "light";

    isLoadingProfile: boolean = true;
    isForbidden: boolean = false;
    profileLoadError: string | null = null;

    subscription: Subscription = new Subscription();

    allWatchedDates: Date[] = [];
    dailyWatchedCounts: Map<string, number> = new Map();
    calendarDays: { date: Date, count: number }[][] = [];
    months: string[] = [];
    maxDailyWatchCount: number = 0;

    currentHeatmapYear: number;

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly movieService: MovieService,
        private readonly themeService: ThemeService,
        private readonly route: ActivatedRoute,
    ) {
        this.currentHeatmapYear = new Date().getFullYear();
    }

    ngOnInit(): void {
        this.subscription.add(
            this.route.paramMap.subscribe((params) => {
                this.profileId = Number(params.get("id"));
                this.profileUser = null;
                this.isForbidden = false;
                this.profileLoadError = null;
                this.isLoadingProfile = true;
                this.loadUser();
            })
        )
        this.subscription.add(
            this.authService.currentUser$.subscribe({
                next: (user) => {
                    this.currentUser = user;

                    if (this.currentUser && this.profileId === this.currentUser.id) {
                        this.fetchAllWatchedDates(this.currentUser.id);
                    } else if (this.profileUser?.isProfilePublic) {
                        this.fetchAllWatchedDates(this.profileId!);
                    }
                },
            })
        );
        this.subscription.add(
            this.themeService.currentTheme$.subscribe({
                next: (theme: string) => {
                    this.currentTheme = theme;
                },
                error: (error: HttpErrorResponse) => {
                    console.error("Error loading current theme: ", error);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadUser(): void {
        if (!this.profileId) return;

        this.subscription.add(
            this.userService.getUserById(this.profileId).subscribe({
                next: (data) => {
                    this.profileUser = data;
                    this.isLoadingProfile = false;
                    if (this.currentUser && this.profileId === this.currentUser.id) {
                        this.fetchAllWatchedDates(this.currentUser.id);
                    } else if (this.profileUser.isProfilePublic && this.profileId) {
                        this.fetchAllWatchedDates(this.profileId);
                    }
                },
                error: (error) => {
                    this.isLoadingProfile = false;
                    console.error("Error loading profile user: ", error);
                    if (error.status === 403) {
                        this.isForbidden = true;
                        this.profileLoadError = error.error?.message || "You do not have permission to view this profile. It might be private.";
                    } else if (error.status === 404) {
                        this.profileLoadError = "User not found.";
                    } else {
                        this.profileLoadError = "An unexpected error occurred while loading the profile.";
                    }
                }
            })
        )
    }

    isOwnProfile(): boolean {
        return this.currentUser?.id === this.profileId;
    }

    isProfilePublic(): boolean {
        return this.profileUser?.isProfilePublic === true;
    }

    shouldShowPrivateInfo(): boolean {
        return this.isOwnProfile() || this.isProfilePublic();
    }

    get availableYears(): number[] {
        const currentYear = new Date().getFullYear();
        const years: number[] = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    }

    private fetchAllWatchedDates(userId: number): void {
        if (!this.shouldShowPrivateInfo()) {
            this.allWatchedDates = [];
            this.processAndGenerateCalendar();
            return;
        }

        this.subscription.add(
            this.movieService.getWatchedDatesByUserId(userId).subscribe({
                next: (dates) => {
                    this.allWatchedDates = dates.map(d => new Date(d));
                    this.processAndGenerateCalendar();
                },
                error: (err) => {
                    console.error("Error fetching all watched dates:", err);
                    this.allWatchedDates = [];
                    this.processAndGenerateCalendar();
                }
            })
        );
    }

    changeHeatmapYear(year: number): void {
        if (year !== this.currentHeatmapYear) {
            this.currentHeatmapYear = year;
            this.processAndGenerateCalendar();
        }
    }

    private processAndGenerateCalendar(): void {
        this.processWatchedDatesForYear();
        this.generateCalendarForYear();
    }
    
    private processWatchedDatesForYear(): void {
        this.dailyWatchedCounts.clear();
        this.maxDailyWatchCount = 0;

        const filteredDates = this.allWatchedDates.filter(
            date => date.getFullYear() === this.currentHeatmapYear
        );

        for (const date of filteredDates) {
            const dateKey = this.formatDateToYYYYMMDD(date);
            const currentCount = (this.dailyWatchedCounts.get(dateKey) || 0) + 1;
            this.dailyWatchedCounts.set(dateKey, currentCount);

            if (currentCount > this.maxDailyWatchCount) {
                this.maxDailyWatchCount = currentCount;
            }
        }
    }

    private generateCalendarForYear(): void {
        this.calendarDays = [];
        this.months = [];

        const yearStartDate = new Date(this.currentHeatmapYear, 0, 1);
        const yearEndDate = new Date(this.currentHeatmapYear, 11, 31);

        let startDate = new Date(yearStartDate);
        while (startDate.getDay() !== 1) {
            startDate.setDate(startDate.getDate() - 1);
        }

        let currentDate = new Date(startDate);
        let week: { date: Date, count: number }[] = [];

        for (let i = 0; i < 12; i++) {
            this.months.push(this.getMonthName(i));
        }

        while (currentDate <= yearEndDate || week.length > 0) {
            const dateKey = this.formatDateToYYYYMMDD(currentDate);
            const count = this.dailyWatchedCounts.get(dateKey) ?? 0;

            if (currentDate.getFullYear() === this.currentHeatmapYear) {
                week.push({ date: new Date(currentDate), count: count });
            } else {
                week.push({ date: new Date(0), count: -1 });
            }

            if (week.length === 7) {
                this.calendarDays.push(week);
                week = [];
            }

            currentDate.setDate(currentDate.getDate() + 1);

            if (currentDate > yearEndDate && week.length === 0) {
                break;
            }
        }

        if (week.length > 0) {
            while (week.length < 7) {
                week.push({ date: new Date(0), count: -1 });
            }
            this.calendarDays.push(week);
        }
    }

    private formatDateToYYYYMMDD(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    private getMonthName(monthIndex: number): string {
        const date = new Date(2000, monthIndex, 1);
        return date.toLocaleString("en-US", { month: "short" });
    }
    
    getHeatmapColor(count: number): string {
        const emptyColor = this.currentTheme === "light" ? "bg-gray-200" : "bg-gray-700";

        if (count === 0) return emptyColor;

        if (this.maxDailyWatchCount === 0) {
            return "bg-green-100";
        }

        const level = Math.ceil((count / this.maxDailyWatchCount) * 4);

        switch (level) {
            case 1: return "bg-green-100";
            case 2: return "bg-green-300";
            case 3: return "bg-green-500";
            case 4: return "bg-green-700";
            default: return emptyColor; 
        }
    }

    faSpinner = faSpinner;
}