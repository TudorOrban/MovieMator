import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { Subscription } from 'rxjs';
import { UserDataDto } from '../../../../core/auth/models/User';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../../movies/services/movie.service';

@Component({
    selector: 'app-user-profile',
    imports: [CommonModule, RouterModule],
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit, OnDestroy {
    currentUser: UserDataDto | null = null;
    isEditModeOn: boolean = false;

    subscription: Subscription = new Subscription();

    watchedDates: Date[] = [];
    dailyWatchedCounts: Map<string, number> = new Map();
    calendarDays: { date: Date, count: number }[][] = [];
    months: string[] = [];
    maxDailyWatchCount: number = 0;

    constructor(
        private readonly authService: AuthService,
        private readonly movieService: MovieService
    ) {}

    ngOnInit(): void {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (user) => {
                this.currentUser = user;

                if (user?.id) {
                    this.loadHeatmapData(user.id);
                }
            },
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private loadHeatmapData(userId: number): void {
        this.subscription.add(
            this.movieService.getWatchedDatesByUserId(userId).subscribe({
                next: (dates) => {
                    this.watchedDates = dates.map(d => new Date(d));
                    this.processWatchedDates();
                    this.generateCalendar();
                },
                error: (err) => {
                    console.error('Error fetching watched dates:', err);
                }
            })
        );
    }

    private processWatchedDates(): void {
        this.dailyWatchedCounts.clear();
        this.maxDailyWatchCount = 0; 
        
        for (const date of this.watchedDates) {
            const dateKey = this.formatDateToYYYYMMDD(date);
            const currentCount = (this.dailyWatchedCounts.get(dateKey) || 0) + 1;
            this.dailyWatchedCounts.set(dateKey, currentCount);

            if (currentCount > this.maxDailyWatchCount) {
                this.maxDailyWatchCount = currentCount;
            }
        }
    }

    private generateCalendar(): void {
        this.calendarDays = [];
        this.months = [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        oneYearAgo.setDate(oneYearAgo.getDate() + 1);

        let currentDate = new Date(oneYearAgo);
        currentDate.setHours(0, 0, 0, 0);

        while (currentDate.getDay() !== 1) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        const endDate = new Date(today);

        let week: { date: Date, count: number }[] = [];
        let currentMonth = -1;

        while (currentDate <= endDate || week.length > 0) {
            if (currentDate <= endDate) {
                const dateKey = this.formatDateToYYYYMMDD(currentDate);
                const count = this.dailyWatchedCounts.get(dateKey) ?? 0;
                week.push({ date: new Date(currentDate), count: count });

                if (currentDate.getMonth() !== currentMonth) {
                    this.months.push(this.getMonthName(currentDate.getMonth()));
                    currentMonth = currentDate.getMonth();
                }
            } else {
                week.push({ date: new Date(0), count: -1 });
            }

            if (week.length === 7) {
                this.calendarDays.push(week);
                week = [];
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        const allMonths: string[] = [];
        let tempDate = new Date(oneYearAgo);
        tempDate.setDate(1);

        while (tempDate <= today) {
            const monthName = this.getMonthName(tempDate.getMonth());
            if (!allMonths.includes(monthName)) {
                allMonths.push(monthName);
            }
            tempDate.setMonth(tempDate.getMonth() + 1);
        }
        this.months = allMonths;
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
        if (count === 0) return "bg-gray-200";
        
        if (this.maxDailyWatchCount === 0) {
            return "bg-green-100";
        }

        const level = Math.ceil((count / this.maxDailyWatchCount) * 4);

        switch (level) {
            case 1: return "bg-green-100";
            case 2: return "bg-green-300";
            case 3: return "bg-green-500";
            case 4: return "bg-green-700";
            default: return "bg-gray-200";
        }
    }
}