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

@Component({
    selector: 'app-statistics',
    imports: [CommonModule, FontAwesomeModule, FormsModule, OrderByPipe],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit, OnDestroy {
    userId?: number;
    statistics?: UserStatistics;

    startDate: string;
    endDate: string;

    isLoading: boolean = false;

    subscription = new Subscription();

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

    onComputeStatistics(): void {
        this.loadStatistics();
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
            },
            error: (error) => {
                console.error("Couldn't get user statistics: ", error);
                this.statistics = undefined;
                this.isLoading = false;
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    
    faSpinner = faSpinner;
}
