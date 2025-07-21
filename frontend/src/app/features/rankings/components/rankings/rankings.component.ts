import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginatedResults, SearchParams } from '../../../../shared/models/Search';
import { RankingSearchDto } from '../../models/Ranking';
import { RankingService } from '../../services/ranking.service';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { combineLatest, filter, Subscription } from 'rxjs';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';
import { PageSelectorComponent } from "../../../../shared/common/components/page-selector/page-selector.component";
import { PublicUserDataDto, UserDataDto, UserSettings } from '../../../user/models/User';
import { ActivatedRoute, Data, ParamMap, RouterModule } from '@angular/router';
import { ErrorMapperService } from '../../../user/services/error-mapper.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { FallbackState, initialFallbackState } from '../../../../shared/fallback/models/Fallback';
import { LoadingFallbackComponent } from "../../../../shared/fallback/components/loading-fallback/loading-fallback.component";
import { ErrorFallbackComponent } from "../../../../shared/fallback/components/error-fallback/error-fallback.component";
import { RankingsHeaderComponent } from './rankings-header/rankings-header.component';
import { RankingsListComponent } from './rankings-list/rankings-list.component';
import { UserService } from '../../../user/services/user.service';

@Component({
    selector: 'app-rankings',
    imports: [CommonModule, FontAwesomeModule, RouterModule, RankingsHeaderComponent, RankingsListComponent, PageSelectorComponent, LoadingFallbackComponent, ErrorFallbackComponent],
    templateUrl: './rankings.component.html',
})
export class RankingsComponent implements OnInit, OnDestroy {
    isCurrentUserRankingsPage: boolean = true;
    userId: number | null = null;
    currentRouteUser: PublicUserDataDto | null = null;
    rankings: PaginatedResults<RankingSearchDto> | null = null;
    userSettings: UserSettings | null = null;

    fallbackState: FallbackState = initialFallbackState;

    searchParams: SearchParams = {
        searchText: "",
        sortBy: "createdAt",
        isAscending: false,
        page: 1,
        itemsPerPage: 27
    };

    isDeleteModeOn: boolean = false;
    toBeDeletedRankingIds: number[] = [];

    private previousUserId: number | null = null;
    private previousSortBy: string | null = null;

    private subscription: Subscription = new Subscription();

    constructor(
        private readonly rankingService: RankingService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly toastService: ToastManagerService,
        private readonly errorMapperService: ErrorMapperService,
        private readonly route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.fallbackState.isLoading = true;

        // Get route userId, current authenticated user and finally search rankings
        this.subscription.add(
            combineLatest([
                this.route.paramMap,
                this.route.data,
                this.authService.currentUser$.pipe(
                    filter(user => user !== null && user !== undefined)
                )
            ])
            .subscribe({
                next: ([paramMap, routeData, currentUser]) => this.handleRouteAndCurrentUserEvent(paramMap, routeData, currentUser),
                error: (error) => this.handleAPIError(error)
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private handleRouteAndCurrentUserEvent(paramMap: ParamMap, routeData: Data, currentUser: UserDataDto): void {
        this.isCurrentUserRankingsPage = routeData["isCurrentUserRankingsPage"];
        const userIdParam = paramMap.get("userId");
        
        if (!this.isCurrentUserRankingsPage) {
            if (!userIdParam) {
                console.error("Couldn't determine userId from route");
                return;
            }
            this.userId = Number(userIdParam);

            this.fetchRouteUser();
        } else {
            this.userId = currentUser?.id;
        }

        this.userSettings = currentUser?.userSettings ?? null;
        if (this.userSettings) {
            this.applyUserSettings();
        }

        // Trigger searchRankings ONLY AFTER userId, route data and currentUser are loaded
        this.fetchInitialRankings();
    }

    private fetchRouteUser(): void {
        if (!this.userId) return;

        this.subscription.add(
            this.userService.getPublicUserById(this.userId).subscribe({
                next: (data: PublicUserDataDto) => {
                    this.currentRouteUser = data;
                }
            })
        )
    }

    private applyUserSettings(): void {
        if (!this?.userSettings) return;
        if (this.userSettings?.defaultRankingSortBy &&
            this.searchParams.sortBy !== this.userSettings.defaultRankingSortBy) {
            this.searchParams.sortBy = this.userSettings.defaultRankingSortBy;
        }
    }

    fetchInitialRankings(): void {
        if (!this.userId) {
            this.fallbackState.isLoading = false;
            return;
        }

        if (this.userId === this.previousUserId && this.searchParams.sortBy === this.previousSortBy) {
            this.fallbackState.isLoading = false;
            return;
        }
        this.previousUserId = this.userId;
        this.previousSortBy = this.searchParams.sortBy;

        this.fallbackState.isLoading = true;

        this.rankingService.searchRankings(this.userId, this.searchParams).subscribe({
            next: (data) => {
                this.rankings = data;
                this.fallbackState.isLoading = false;
            },
            error: (error) => this.handleAPIError(error)
        });
    }

    searchRankings(): void {
        if (!this.userId) return;

        this.fallbackState.isLoading = true;

        this.rankingService.searchRankings(this.userId, this.searchParams).subscribe({
            next: (data) => {
                this.rankings = data;
                this.fallbackState.isLoading = false;
            },
            error: (error) => this.handleAPIError(error)
        });
    }

    private handleAPIError(error: HttpErrorResponse) {
        console.error("Error searching rankings: ", error);
        const { message, isForbidden } = this.errorMapperService.mapProfileError(error);
        this.fallbackState = { isLoading: false, errorMessage: message, isForbidden: isForbidden };
    }

    handleSortOptionsChange(): void {
        this.searchParams.page = 1;
    }
    
    handlePageChange(newPage: number): void {
        this.searchParams.page = newPage;
        this.searchRankings();
    }

    toggleDeleteMode(): void {
        this.isDeleteModeOn = !this.isDeleteModeOn;
        this.toBeDeletedRankingIds = []; 
    }

    handleNewDeleteRankingId(id: number): void {
        if (this.toBeDeletedRankingIds.includes(id)) {
            this.toBeDeletedRankingIds = this.toBeDeletedRankingIds.filter(rankingId => rankingId !== id);
        } else {
            this.toBeDeletedRankingIds.push(id);
        }
    }

    clearDeleteRankingIds(): void {
        this.toBeDeletedRankingIds = [];
        this.isDeleteModeOn = false;
    }

    deleteRankings(): void {
        if (!this.isDeleteModeOn || this.toBeDeletedRankingIds.length === 0) return;

        this.fallbackState.isLoading = true;

        this.rankingService.deleteRankings(this.toBeDeletedRankingIds).subscribe({
            next: () => {
                this.isDeleteModeOn = false;
                this.toBeDeletedRankingIds = [];
                this.toastService.addToast({ title: "Success", details: "Rankings deleted successfully.", type: ToastType.SUCCESS });
                this.searchParams.page = 1;
                this.searchRankings();
            },
            error: (error) => {
                this.fallbackState.isLoading = false;
                this.toastService.addToast({ title: "Error", details: "An error occurred deleting the rankings.", type: ToastType.ERROR });
                console.error("Error deleting rankings: ", error);
            }
        })
    }

    faSpinner = faSpinner;
}
