import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserStatisticsService } from '../../services/user-statistics.service';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { Subscription } from 'rxjs';
import { UserStatistics } from '../../models/UserStatistics';
import { CommonModule } from '@angular/common';
import { OrderByPipe } from '../../../../shared/common/pipes/order-by.pipe';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-statistics',
    imports: [CommonModule, FontAwesomeModule, FormsModule, BaseChartDirective, OrderByPipe],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit, OnDestroy {
    userId?: number;
    statistics?: UserStatistics;

    startDate: string;
    endDate: string;

    isLoading: boolean = false;

    actorDisplayLimit: number = 20;
    showAllActors: boolean = false;

    subscription = new Subscription();

    public releaseYearBarChartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + " movies";
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Release Year"
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 45, 
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Number of Movies"
                },
                ticks: {
                    stepSize: 1
                },
            }
        }
    };
    public releaseYearBarChartLabels: string[] = [];
    public releaseYearBarChartData: ChartConfiguration<"bar">["data"] = {
        labels: this.releaseYearBarChartLabels,
        datasets: [
            {
                data: [],
                backgroundColor: "rgba(255, 193, 7, 0.7)",
                borderColor: "rgba(255, 193, 7, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255, 193, 7, 0.9)",
                hoverBorderColor: "rgba(255, 193, 7, 1)"
            }
        ]
    };

    constructor(
        private readonly statisticsService: UserStatisticsService,
        private readonly authService: AuthService
    ) {
        const defaultEndDate = new Date();
        const defaultStartDate = new Date();
        defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);

        this.startDate = defaultStartDate.toISOString().substring(0, 10);
        this.endDate = defaultEndDate.toISOString().substring(0, 10);
    }

    ngOnInit(): void {
        this.subscription.add(this.authService.currentUser$.subscribe({
            next: (data) => {
                this.userId = data?.id;
                this.loadStatistics();
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onComputeStatistics(): void {
        this.loadStatistics();
    }

    toggleShowAllActors(): void {
        this.showAllActors = !this.showAllActors;
    }

    private loadStatistics(): void {
        if (!this.userId) return;
        
        const selectedStartDate = new Date(this.startDate);
        const selectedEndDate = new Date(this.endDate);
        if (!selectedStartDate || !selectedEndDate || isNaN(selectedStartDate.getTime()) || isNaN(selectedEndDate.getTime())) {
            console.error('Please select valid start and end dates.');
            return;
        }

        this.isLoading = true;

        this.subscription.add(this.statisticsService.getUserStatistics(this.userId, selectedStartDate, selectedEndDate).subscribe({
            next: (data) => {
                this.statistics = data;
                this.isLoading = false;
                this.processReleaseYearDataForChart();
            },
            error: (error) => {
                console.error("Couldn't get user statistics: ", error);
                this.statistics = undefined;
                this.isLoading = false;
            }
        }));
    }

    
    private processReleaseYearDataForChart(): void {
        if (!this.statistics?.movieCountByReleaseYear) {
            this.releaseYearBarChartLabels = [];
            this.releaseYearBarChartData = { labels: [], datasets: [{ ...this.releaseYearBarChartData.datasets[0] }] };
            return;
        } 

        const rawMovieCounts = Object.entries(this.statistics.movieCountByReleaseYear)
                                        .map(([year, count]) => ({ key: parseInt(year), value: count as number })); // Parse year to number for easier min/max

        if (rawMovieCounts.length === 0) {
            this.releaseYearBarChartLabels = [];
            this.releaseYearBarChartData = { labels: [], datasets: [{ ...this.releaseYearBarChartData.datasets[0] }] };
            return;
        }

        // Find the minimum and maximum years from your data
        const minYear = Math.min(...rawMovieCounts.map(entry => entry.key));
        const maxYear = Math.max(...rawMovieCounts.map(entry => entry.key));

        const yearCountsMap = new Map<number, number>();
        rawMovieCounts.forEach(entry => yearCountsMap.set(entry.key, entry.value));

        const fullRangeLabels: string[] = [];
        const fullRangeData: number[] = [];

        for (let year = minYear; year <= maxYear; year++) {
            fullRangeLabels.push(year.toString());
            fullRangeData.push(yearCountsMap.get(year) || 0);
        }
                                
        this.releaseYearBarChartLabels = fullRangeLabels;

        this.releaseYearBarChartData = {
            labels: this.releaseYearBarChartLabels,
            datasets: [
                {
                    data: fullRangeData,
                    backgroundColor: 'rgba(255, 193, 7, 0.7)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255, 193, 7, 0.9)',
                    hoverBorderColor: 'rgba(255, 193, 7, 1)',
                }
            ]
        };
    }
    
    faSpinner = faSpinner;
}
