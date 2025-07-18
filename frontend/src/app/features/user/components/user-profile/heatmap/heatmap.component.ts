import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-heatmap',
    imports: [CommonModule],
    templateUrl: './heatmap.component.html',
    styleUrl: './heatmap.component.css'
})
export class HeatmapComponent implements OnChanges {
    @Input() allWatchedDates: Date[] = [];
    @Input() currentTheme?: string;

    dailyWatchedCounts: Map<string, number> = new Map();
    calendarDays: { date: Date, count: number }[][] = [];
    months: string[] = [];
    maxDailyWatchCount: number = 0;

    currentHeatmapYear: number;

    constructor() {
        this.currentHeatmapYear = new Date().getFullYear();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["allWatchedDates"]?.currentValue?.length !== changes["allWatchedDates"]?.previousValue?.length) {
            this.processAndGenerateCalendar();
        }
    }

    get availableYears(): number[] {
        const currentYear = new Date().getFullYear();
        const years: number[] = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    }

    changeHeatmapYear(year: number): void {
        if (year !== this.currentHeatmapYear) {
            this.currentHeatmapYear = year;
            this.processAndGenerateCalendar();
        }
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
}
