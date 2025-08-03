import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserStatisticsService } from "../../services/user-statistics.service";
import { AuthService } from "../../../../core/auth/service/auth.service";
import { Subscription } from "rxjs";
import { UserStatistics } from "../../models/UserStatistics";
import { CommonModule } from "@angular/common";
import { OrderByPipe } from "../../../../shared/common/pipes/order-by.pipe";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";

@Component({
    selector: "app-statistics",
    imports: [CommonModule, FontAwesomeModule, FormsModule, BaseChartDirective, OrderByPipe],
    templateUrl: "./statistics.component.html",
    styleUrl: "./statistics.component.css"
})
export class StatisticsComponent implements OnInit, OnDestroy {
    userId?: number;
    statistics?: UserStatistics;

    startDate: string;
    endDate: string;

    isLoading: boolean = false;

    directorDisplayLimit: number = 20;
    showAllDirectors: boolean = false;
    genreDisplayLimit: number = 20;
    showAllGenres: boolean = false;
    actorDisplayLimit: number = 20;
    showAllActors: boolean = false;

    subscription = new Subscription();

    public watchedMonthYearBarChartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || "";
                        if (label) { label += ": "; }
                        if (context.parsed.y !== null) { label += context.parsed.y + " movies"; }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: "Month" },
                type: "category",
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: "Number of Movies" },
                ticks: {
                    stepSize: 1
                }
            }
        }
    };
    public watchedMonthYearBarChartLabels: string[] = [];
    public watchedMonthYearBarChartType: "bar" = "bar";
    public watchedMonthYearBarChartData: ChartConfiguration<"bar">["data"] = {
        labels: this.watchedMonthYearBarChartLabels,
        datasets: [
            {
                data: [],
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(54, 162, 235, 0.9)",
                hoverBorderColor: "rgba(54, 162, 235, 1)"
            }
        ]
    };
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
    public userRatingBarChartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || "";
                        if (label) { label += ": "; }
                        if (context.parsed.y !== null) { label += context.parsed.y + " movies"; }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: "User Rating" },
                type: "linear",
                grid: { offset: true },
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: "Number of Movies" },
                ticks: {
                    stepSize: 1
                },
            }
        }
    };
    public userRatingBarChartLabels: string[] = [];
    public userRatingBarChartType: "bar" = "bar"; 
    public userRatingBarChartData: ChartConfiguration<"bar">["data"] = {
        labels: this.userRatingBarChartLabels,
        datasets: [
            {
                data: [],
                backgroundColor: "rgba(255, 165, 0, 0.7)",
                borderColor: "rgba(255, 165, 0, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255, 165, 0, 0.9)",
                hoverBorderColor: "rgba(255, 165, 0, 1)"
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

    toggleShowAllDirectors(): void {
        this.showAllDirectors = !this.showAllDirectors;
    }

    toggleShowAllGenres(): void {
        this.showAllGenres = !this.showAllGenres;
    }

    toggleShowAllActors(): void {
        this.showAllActors = !this.showAllActors;
    }

    private loadStatistics(): void {
        if (!this.userId) return;
        
        const selectedStartDate = new Date(this.startDate);
        const selectedEndDate = new Date(this.endDate);
        if (!selectedStartDate || !selectedEndDate || isNaN(selectedStartDate.getTime()) || isNaN(selectedEndDate.getTime())) {
            console.error("Please select valid start and end dates.");
            return;
        }

        this.isLoading = true;

        this.subscription.add(this.statisticsService.getUserStatistics(this.userId, selectedStartDate, selectedEndDate).subscribe({
            next: (data) => {
                this.statistics = data;
                this.isLoading = false;
                this.processWatchedMonthYearDataForChart();
                this.processReleaseYearDataForChart();
                this.processUserRatingDataForChart();
            },
            error: (error) => {
                console.error("Could not get user statistics: ", error);
                this.statistics = undefined;
                this.isLoading = false;
            }
        }));
    }
    
    private processWatchedMonthYearDataForChart(): void {
        if (!this.statistics?.movieCountByWatchedMonthAndYear || Object.keys(this.statistics.movieCountByWatchedMonthAndYear).length === 0) {
            this.watchedMonthYearBarChartLabels = [];
            this.watchedMonthYearBarChartData = { labels: [], datasets: [{ ...this.watchedMonthYearBarChartData.datasets[0] }] };
            return;
        }

        // Find the minimum and maximum range from the data
        const statStartDate = new Date(this.statistics.startDate + 'T00:00:00');
        const statEndDate = new Date(this.statistics.endDate + 'T00:00:00');

        const monthYearCountsMap = new Map<string, number>();
        Object.entries(this.statistics.movieCountByWatchedMonthAndYear).forEach(([monthYear, count]) => {
            monthYearCountsMap.set(monthYear, count as number);
        });

        const fullRangeLabels: string[] = [];
        const fullRangeData: number[] = [];

        let currentDate = new Date(statStartDate.getFullYear(), statStartDate.getMonth(), 1); 
        
        while (currentDate.getTime() <= statEndDate.getTime() || 
               (currentDate.getFullYear() === statEndDate.getFullYear() && currentDate.getMonth() <= statEndDate.getMonth())) {
            
            const monthName = currentDate.toLocaleString('en-US', { month: 'short' }); 
            const year = currentDate.getFullYear();
            const formattedMonthYear = `${monthName} ${year}`;

            fullRangeLabels.push(formattedMonthYear);
            fullRangeData.push(monthYearCountsMap.get(formattedMonthYear) || 0);

            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(1); 
        }
                                    
        this.watchedMonthYearBarChartLabels = fullRangeLabels;
        this.watchedMonthYearBarChartData = {
            labels: this.watchedMonthYearBarChartLabels,
            datasets: [
                {
                    data: fullRangeData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)',
                    hoverBorderColor: 'rgba(54, 162, 235, 1)'
                }
            ]
        };
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
                    backgroundColor: "rgba(255, 193, 7, 0.7)",
                    borderColor: "rgba(255, 193, 7, 1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255, 193, 7, 0.9)",
                    hoverBorderColor: "rgba(255, 193, 7, 1)",
                }
            ]
        };
    }

    private processUserRatingDataForChart(): void {
        if (!this.statistics?.userRatingDistribution) {
            this.userRatingBarChartLabels = [];
            this.userRatingBarChartData = { labels: [], datasets: [{ ...this.userRatingBarChartData.datasets[0] }] };
            return;
        }

        const rawRatingCounts = Object.entries(this.statistics.userRatingDistribution)
                                        .map(([rating, count]) => ({ key: parseFloat(rating), value: count as number }));
        if (rawRatingCounts.length === 0) {
            this.userRatingBarChartLabels = [];
            this.userRatingBarChartData = { labels: [], datasets: [{ ...this.userRatingBarChartData.datasets[0] }] };
            return;
        }

        const minObservedRating = Math.min(...rawRatingCounts.map(entry => entry.key));
        const maxObservedRating = Math.max(...rawRatingCounts.map(entry => entry.key));

        const ratingStep = 0.1; 
        const chartMinRating = Math.floor(minObservedRating / ratingStep) * ratingStep; 
        const chartMaxRating = Math.ceil(maxObservedRating / ratingStep) * ratingStep; 
        
        const finalChartMinRating = Math.max(0.0, chartMinRating);
        const finalChartMaxRating = Math.min(10.0, chartMaxRating);

        const ratingCountsMap = new Map<number, number>();
        rawRatingCounts.forEach(entry => ratingCountsMap.set(entry.key, entry.value));

        const fullRangeLabels: string[] = [];
        const fullRangeData: number[] = [];

        for (let rating = finalChartMinRating; rating <= finalChartMaxRating + Number.EPSILON; rating = parseFloat((rating + ratingStep).toFixed(1))) {
            const formattedRating = rating.toFixed(1);
            fullRangeLabels.push(formattedRating);
            fullRangeData.push(ratingCountsMap.get(parseFloat(formattedRating)) || 0); 
        }

        this.userRatingBarChartLabels = fullRangeLabels;
        this.userRatingBarChartData = {
            labels: this.userRatingBarChartLabels,
            datasets: [
                {
                    data: fullRangeData,
                    backgroundColor: "rgba(255, 165, 0, 0.7)",
                    borderColor: "rgba(255, 165, 0, 1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255, 165, 0, 0.9)",
                    hoverBorderColor: "rgba(255, 165, 0, 1)"
                }
            ]
        };
    }
    
    faSpinner = faSpinner;
}
