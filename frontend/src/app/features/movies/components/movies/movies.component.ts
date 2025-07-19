import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MovieFilters, PaginatedResults, SearchParams } from '../../../../shared/models/Search';
import { MovieSearchDto } from '../../models/Movie';
import { MovieService } from '../../services/movie.service';
import { MoviesHeaderComponent } from "./movies-header/movies-header.component";
import { MoviesListComponent } from "./movies-list/movies-list.component";
import { AuthService } from '../../../../core/auth/service/auth.service';
import { combineLatest, Subscription } from 'rxjs';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';
import { PageSelectorComponent } from "../../../../shared/common/components/page-selector/page-selector.component";
import { UserSettings } from '../../../user/models/User';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ErrorMapperService } from '../../../user/services/error-mapper.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-movies',
    imports: [CommonModule, FontAwesomeModule, RouterModule, MoviesHeaderComponent, MoviesListComponent, PageSelectorComponent],
    templateUrl: './movies.component.html',
})
export class MoviesComponent implements OnInit, OnDestroy {
    isCurrentUserMoviesPage?: boolean = true;

    userId?: number;
    movies?: PaginatedResults<MovieSearchDto>;
    userSettings?: UserSettings;

    isLoading: boolean = false;
    isForbidden: boolean = false;
    loadingError: string | null = null;

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

    private subscription: Subscription = new Subscription();

    constructor(
        private readonly movieService: MovieService,
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
        private readonly errorMapperService: ErrorMapperService,
        private readonly route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isLoading = true;

        this.subscription.add(
            combineLatest([
                this.route.paramMap,
                this.authService.currentUser$
            ])
            .subscribe({
                next: ([paramMap, currentUser]) => {
                    const userIdParam = paramMap.get("userId");
                    this.userSettings = currentUser?.userSettings;

                    if (userIdParam) {
                        // Is on /user-profile/:userId/movies route
                        this.isCurrentUserMoviesPage = false;
                        this.userId = +userIdParam;
                    } else {
                        // Is on /movies route (current user)
                        this.isCurrentUserMoviesPage = true;
                        this.userId = currentUser?.id;
                    }

                    if (this.userSettings) {
                        this.applyUserSettings();
                    }

                    this.searchMovies();
                },
                error: (error) => {
                    console.error("Error combining route data and current user:", error);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private applyUserSettings(): void {
        if (!this?.userSettings) return;
        if (this.userSettings?.defaultMovieSortBy) {
            this.searchParams.sortBy = this.userSettings.defaultMovieSortBy;
        } 
    }

    searchMovies(): void {
        if (!this.userId) return;

        this.isLoading = true;

        this.movieService.searchMovies(this.userId, this.searchParams, this.movieFilters).subscribe({
            next: (data) => {
                this.movies = data;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                console.error("Error searching movies: ", error);

                const { message, isForbidden } = this.errorMapperService.mapProfileError(error);
                this.loadingError = message;
                this.isForbidden = isForbidden;
            }
        });
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

        this.isLoading = true;

        this.movieService.deleteMovies(this.toBeDeletedMovieIds).subscribe({
            next: () => {
                this.isDeleteModeOn = false;
                this.toBeDeletedMovieIds = [];
                this.toastService.addToast({ title: "Success", details: "Movies deleted successfully.", type: ToastType.SUCCESS });
                this.searchParams.page = 1;
                this.searchMovies();
            },
            error: (error) => {
                this.isLoading = false;
                this.toastService.addToast({ title: "Error", details: "An error occurred deleting the movies.", type: ToastType.ERROR });
                console.error("Error deleting movies: ", error);
            }
        })
    }

    faSpinner = faSpinner;
}
