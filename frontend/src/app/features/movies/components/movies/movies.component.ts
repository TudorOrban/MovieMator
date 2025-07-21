import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MovieFilters, PaginatedResults, SearchParams } from '../../../../shared/models/Search';
import { MovieSearchDto } from '../../models/Movie';
import { MovieService } from '../../services/movie.service';
import { MoviesHeaderComponent } from "./movies-header/movies-header.component";
import { MoviesListComponent } from "./movies-list/movies-list.component";
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
import { UserService } from '../../../user/services/user.service';

@Component({
    selector: 'app-movies',
    imports: [CommonModule, FontAwesomeModule, RouterModule, MoviesHeaderComponent, MoviesListComponent, PageSelectorComponent, LoadingFallbackComponent, ErrorFallbackComponent],
    templateUrl: './movies.component.html',
})
export class MoviesComponent implements OnInit, OnDestroy {
    isCurrentUserMoviesPage: boolean = true;
    userId: number | null = null;
    currentRouteUser: PublicUserDataDto | null = null;
    movies: PaginatedResults<MovieSearchDto> | null = null;
    userSettings: UserSettings | null = null;

    fallbackState: FallbackState = initialFallbackState;

    searchParams: SearchParams = {
        searchText: "",
        sortBy: "watchedDate",
        isAscending: false,
        page: 1,
        itemsPerPage: 27
    };
    movieFilters: MovieFilters = {}

    isDeleteModeOn: boolean = false;
    toBeDeletedMovieIds: number[] = [];

    private previousUserId: number | null = null;
    private previousSortBy: string | null = null;

    private subscription: Subscription = new Subscription();

    constructor(
        private readonly movieService: MovieService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly toastService: ToastManagerService,
        private readonly errorMapperService: ErrorMapperService,
        private readonly route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.fallbackState.isLoading = true;

        // Get route userId, current authenticated user and finally search movies
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
        this.isCurrentUserMoviesPage = routeData["isCurrentUserMoviesPage"];
        const userIdParam = paramMap.get("userId");
        
        if (!this.isCurrentUserMoviesPage) {
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

        // Trigger searchMovies ONLY AFTER userId, route data and currentUser are loaded
        this.fetchInitialMovies();
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
        if (this.userSettings?.defaultMovieSortBy &&
            this.searchParams.sortBy !== this.userSettings.defaultMovieSortBy) {
            this.searchParams.sortBy = this.userSettings.defaultMovieSortBy;
        }
    }

    fetchInitialMovies(): void {
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

        this.movieService.searchMovies(this.userId, this.searchParams, this.movieFilters).subscribe({
            next: (data) => {
                this.movies = data;
                this.fallbackState.isLoading = false;
            },
            error: (error) => this.handleAPIError(error)
        });
    }

    searchMovies(): void {
        if (!this.userId) return;

        this.fallbackState.isLoading = true;

        this.movieService.searchMovies(this.userId, this.searchParams, this.movieFilters).subscribe({
            next: (data) => {
                this.movies = data;
                this.fallbackState.isLoading = false;
            },
            error: (error) => this.handleAPIError(error)
        });
    }

    private handleAPIError(error: HttpErrorResponse) {
        console.error("Error searching movies: ", error);
        const { message, isForbidden } = this.errorMapperService.mapProfileError(error);
        this.fallbackState = { isLoading: false, errorMessage: message, isForbidden: isForbidden };
    }

    handleSortOptionsChange(): void {
        this.searchParams.page = 1;
    }

    handleMovieFiltersChange(newFilters: MovieFilters): void {
        this.movieFilters = newFilters;
        this.searchParams.page = 1;
        this.searchMovies();
    }

    handlePageChange(newPage: number): void {
        this.searchParams.page = newPage;
        this.searchMovies();
    }

    toggleDeleteMode(): void {
        this.isDeleteModeOn = !this.isDeleteModeOn;
        this.toBeDeletedMovieIds = []; 
    }

    handleNewDeleteMovieId(id: number): void {
        if (this.toBeDeletedMovieIds.includes(id)) {
            this.toBeDeletedMovieIds = this.toBeDeletedMovieIds.filter(movieId => movieId !== id);
        } else {
            this.toBeDeletedMovieIds.push(id);
        }
    }

    clearDeleteMovieIds(): void {
        this.toBeDeletedMovieIds = [];
        this.isDeleteModeOn = false;
    }

    deleteMovies(): void {
        if (!this.isDeleteModeOn || this.toBeDeletedMovieIds.length === 0) return;

        this.fallbackState.isLoading = true;

        this.movieService.deleteMovies(this.toBeDeletedMovieIds).subscribe({
            next: () => {
                this.isDeleteModeOn = false;
                this.toBeDeletedMovieIds = [];
                this.toastService.addToast({ title: "Success", details: "Movies deleted successfully.", type: ToastType.SUCCESS });
                this.searchParams.page = 1;
                this.searchMovies();
            },
            error: (error) => {
                this.fallbackState.isLoading = false;
                this.toastService.addToast({ title: "Error", details: "An error occurred deleting the movies.", type: ToastType.ERROR });
                console.error("Error deleting movies: ", error);
            }
        })
    }

    faSpinner = faSpinner;
}
