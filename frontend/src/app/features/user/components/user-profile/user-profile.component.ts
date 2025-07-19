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
import { HeatmapComponent } from "./heatmap/heatmap.component";
import { ErrorMapperService } from '../../services/error-mapper.service';
import { MovieSearchDto } from '../../../movies/models/Movie';
import { ErrorFallbackComponent } from "../../../../shared/fallback/components/error-fallback/error-fallback.component";
import { FallbackState, initialFallbackState } from '../../../../shared/fallback/models/Fallback';
import { LoadingFallbackComponent } from "../../../../shared/fallback/components/loading-fallback/loading-fallback.component";

@Component({
    selector: 'app-user-profile',
    imports: [CommonModule, RouterModule, FontAwesomeModule, HeatmapComponent, ErrorFallbackComponent, LoadingFallbackComponent],
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit, OnDestroy {
    profileId: number | null = null;
    profileUser: UserDataDto | null = null;
    profileMovies: MovieSearchDto[] | null = null;

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
        private readonly themeService: ThemeService,
        private readonly errorMapperService: ErrorMapperService, 
        private readonly route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            this.route.paramMap.subscribe((params) => {
                this.profileId = Number(params.get("userId"));
                this.profileUser = null;
                this.fallbackState = { isLoading: true, errorMessage: null, isForbidden: false };
                this.loadUserData();
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

    loadUserData(): void {
        if (!this.profileId) return;

        this.subscription.add(
            this.userService.getUserById(this.profileId).subscribe({
                next: (data) => {
                    this.profileUser = data;
                    this.fallbackState.isLoading = false;

                    var userIdToFetchDates;
                    if (this.currentUser && this.profileId === this.currentUser.id) {
                        userIdToFetchDates = this.currentUser.id;
                    } else if (this.profileUser.isProfilePublic && this.profileId) {
                        userIdToFetchDates = this.profileId;
                    } else {
                        return;
                    }
                    this.fetchAllWatchedDates(userIdToFetchDates);
                },
                error: (error) => {
                    console.error("Error loading profile user: ", error);
                    const { message, isForbidden } = this.errorMapperService.mapProfileError(error);
                    this.fallbackState = { isLoading: false, errorMessage: message, isForbidden: isForbidden };
                }
            })
        );
        this.subscription.add(
            this.movieService.getTopRatedMovies(this.profileId, 5).subscribe({
                next: (data) => {
                    this.profileMovies = data;
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

    private fetchAllWatchedDates(userId: number): void {
        if (!this.shouldShowPrivateInfo()) {
            this.allWatchedDates = [];
            return;
        }

        this.subscription.add(
            this.movieService.getWatchedDatesByUserId(userId).subscribe({
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
}