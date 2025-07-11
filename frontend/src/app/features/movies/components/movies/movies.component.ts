import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MovieFilters, PaginatedResults, SearchParams } from '../../../../shared/models/Search';
import { MovieSearchDto } from '../../models/Movie';
import { MovieService } from '../../services/movie.service';
import { MoviesHeaderComponent } from "./movies-header/movies-header.component";
import { MoviesListComponent } from "./movies-list/movies-list.component";
import { AuthService } from '../../../../core/auth/service/auth.service';
import { Subscription } from 'rxjs';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';
import { PageSelectorComponent } from "../../../../shared/common/components/page-selector/page-selector.component";

@Component({
    selector: 'app-movies',
    imports: [CommonModule, FontAwesomeModule, MoviesHeaderComponent, MoviesListComponent, PageSelectorComponent],
    templateUrl: './movies.component.html',
})
export class MoviesComponent implements OnInit, OnDestroy {
    movies?: PaginatedResults<MovieSearchDto>;
    userId?: number;
    searchParams: SearchParams = {
        searchText: "",
        sortBy: "watchedDate",
        isAscending: true,
        page: 1,
        itemsPerPage: 20
    };
    movieFilters: MovieFilters = {}
    isLoading: boolean = false;

    isDeleteModeOn: boolean = false;
    toBeDeletedMovieIds: number[] = [];

    private subscription: Subscription = new Subscription();

    constructor(
        private readonly movieService: MovieService,
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
    ) {}

    ngOnInit() {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (data) => {
                this.userId = data?.id;
                this.searchMovies();
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
            }
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
                console.error("Error searching movies: ", error);
                this.isLoading = false;
            }
        });
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
}
