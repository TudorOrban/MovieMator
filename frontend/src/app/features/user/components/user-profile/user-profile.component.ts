import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { combineLatest, filter, Subscription } from 'rxjs';
import { PublicUserDataDto, UserDataDto } from '../../models/User';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../../movies/services/movie.service';
import { ThemeService } from '../../../../shared/common/services/theme.service';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeatmapComponent } from "./heatmap/heatmap.component";
import { ErrorMapperService } from '../../services/error-mapper.service';
import { MovieSearchDto } from '../../../movies/models/Movie';
import { ErrorFallbackComponent } from "../../../../shared/fallback/components/error-fallback/error-fallback.component";
import { FallbackState, initialFallbackState } from '../../../../shared/fallback/models/Fallback';
import { LoadingFallbackComponent } from "../../../../shared/fallback/components/loading-fallback/loading-fallback.component";
import { RankingSearchDto, RankingType } from '../../../rankings/models/Ranking';
import { RankingService } from '../../../rankings/services/ranking.service';
import { FormatRankingTypePipe } from "../../../../shared/common/pipes/format-ranking-type";

@Component({
    selector: 'app-user-profile',
    imports: [CommonModule, RouterModule, FontAwesomeModule, HeatmapComponent, ErrorFallbackComponent, LoadingFallbackComponent, FormatRankingTypePipe],
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit, OnDestroy {
    isCurrentUserProfilePage: boolean = false;
    userId: number | null = null;
    profileUser: UserDataDto | PublicUserDataDto | null = null;
    profileMovies: MovieSearchDto[] | null = null;
    profileRankings: RankingSearchDto[] | null = null;

    currentUser: UserDataDto | null = null;
    isEditModeOn: boolean = false;
    currentTheme: string = "light";
    
    fallbackState: FallbackState = initialFallbackState;

    subscription: Subscription = new Subscription();

    allWatchedDates: Date[] = [];

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly movieService: MovieService,
        private readonly rankingService: RankingService,
        private readonly themeService: ThemeService,
        private readonly errorMapperService: ErrorMapperService, 
        private readonly route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            combineLatest([
                this.route.paramMap,
                this.authService.currentUser$.pipe(
                    filter(user => !!user)
                )
            ])
            .subscribe({
                next: ([paramMap, currentUser]) => {
                    this.userId = Number(paramMap.get("userId"));
                    this.isCurrentUserProfilePage = !!this.userId && this.userId === currentUser?.id;
                    this.currentUser = currentUser;

                    this.profileUser = null;
                    this.fallbackState = { isLoading: true, errorMessage: null, isForbidden: false };
                    this.loadUserData();
                }
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

    loadUserData(): void {
        if (!this.userId) return;

        this.loadMainData();
        this.loadTopRatedMovies();
        this.loadRankings();
        this.fetchAllWatchedDates();
    }

    loadMainData(): void {
        if (!this.userId) return;

        if (this.isCurrentUserProfilePage) {

            this.subscription.add(
                this.userService.getUserById(this.userId).subscribe({
                    next: (data) => this.handleAPIResponse(data),
                    error: (error) => this.handleAPIError(error)
                })
            );
        } else {
            this.subscription.add(
                this.userService.getPublicUserById(this.userId).subscribe({
                    next: (data) => this.handleAPIResponse(data),
                    error: (error) => this.handleAPIError(error)
                })
            );
        }
    }

    loadTopRatedMovies(): void {
        this.subscription.add(
            this.movieService.getTopRatedMovies(this.userId!, 5).subscribe({
                next: (data) => {
                    this.profileMovies = data;
                }
            })
        );
    }

    loadRankings(): void {
        this.subscription.add(
            this.rankingService.searchRankings(this.userId!, { searchText: "", sortBy: "createdAt", isAscending: true, page: 1, itemsPerPage: 20 }).subscribe({
                next: (data) => {
                    this.profileRankings = data.results;
                }
            })
        );
    }

    isOwnProfile(): boolean {
        return this.currentUser?.id === this.userId;
    }

    isProfilePublic(): boolean {
        return this.profileUser?.isProfilePublic === true;
    }

    shouldShowPrivateInfo(): boolean {
        return this.isOwnProfile() || this.isProfilePublic();
    }

    private handleAPIResponse(data: UserDataDto | PublicUserDataDto) {
        this.profileUser = data;
        this.fallbackState.isLoading = false;
        this.fetchAllWatchedDates();
    }

    private handleAPIError(error: HttpErrorResponse): void {
        console.error("Error loading profile user: ", error);
        const { message, isForbidden } = this.errorMapperService.mapProfileError(error);
        this.fallbackState = { isLoading: false, errorMessage: message, isForbidden: isForbidden };
    }

    private fetchAllWatchedDates(): void {
        if (!this.shouldShowPrivateInfo()) {
            this.allWatchedDates = [];
            return;
        }

        this.subscription.add(
            this.movieService.getWatchedDatesByUserId(this.userId!).subscribe({
                next: (dates) => {
                    this.allWatchedDates = dates.map(d => new Date(d));
                },
                error: (err) => {
                    console.error("Error fetching all watched dates:", err);
                    this.allWatchedDates = [];
                }
            })
        );
    }

    faSpinner = faSpinner;
    RankingType = RankingType;
}