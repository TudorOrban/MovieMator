import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { combineLatest, debounceTime, filter, Subject, Subscription, switchMap } from 'rxjs';
import { MovieService } from '../../../../movies/services/movie.service';
import { MovieFilters, PageSearchConfiguration, PaginatedResults, SearchParams } from '../../../../../shared/models/Search';
import { AuthService } from '../../../../../core/auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from "../../../../../shared/common/components/search-input/search-input.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FiltersBarComponent } from "../../../../movies/components/movies/movies-header/filters-bar/filters-bar.component";
import { pagesSearchConfiguration } from '../../../../../core/main/config/pagesStandardConfig';
import { faArrowDownShortWide, faArrowUpWideShort, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastManagerService } from '../../../../../shared/common/services/toast-manager.service';
import { FallbackState, initialFallbackState } from '../../../../../shared/fallback/models/Fallback';
import { MovieSmallDto, MovieSmallDtoUi } from '../../../../movies/models/Movie';
import { ToastType, UIItem } from '../../../../../shared/models/UI';
import { SelectorComponent } from "../../../../../shared/common/components/selector/selector.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-import-movies-dialog',
    imports: [CommonModule, FontAwesomeModule, RouterModule, SearchInputComponent, FiltersBarComponent, SelectorComponent],
    templateUrl: './import-movies-dialog.component.html',
    styleUrl: './import-movies-dialog.component.css'
})
export class ImportMoviesDialogComponent implements OnInit, OnDestroy {
    @Output() onMoviesImported = new EventEmitter<MovieSmallDto[]>();
    @Output() onCancelMoviesImport = new EventEmitter<void>();

    userId: number | null = null;
    movies: PaginatedResults<MovieSmallDtoUi> | null = null;

    searchParams: SearchParams = {
        searchText: "",
        sortBy: "watchedDate",
        isAscending: false,
        page: 1,
        itemsPerPage: 200
    };
    movieFilters: MovieFilters = {}
    searchConfig: PageSearchConfiguration = pagesSearchConfiguration.pagesConfig["/movies"];

    fallbackState: FallbackState = initialFallbackState;

    private subscription = new Subscription();
    private searchTrigger$ = new Subject<void>(); 

    constructor(
        private readonly movieService: MovieService,
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            combineLatest([
                this.authService.currentUser$.pipe(
                    filter(user => user?.id != null)
                ),
                this.searchTrigger$.pipe(
                    debounceTime(300),
                )
            ]).pipe(
                switchMap(([user, _]) => {
                    this.userId = user!.id!; 
                    return this.movieService.searchSmallMovies(this.userId!, this.searchParams, this.movieFilters);
                })
            ).subscribe({
                next: (data: PaginatedResults<MovieSmallDto>) => {
                    this.movies = data;
                },
                error: (err) => {
                    console.error("Error searching movies:", err);
                }
            })
        );
        
        this.searchTrigger$.next(); 
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    handleSearchTextChange(searchText: string): void {
        this.searchParams.searchText = searchText;
        this.searchParams.page = 1;
        this.searchTrigger$.next(); 
    }

    handleSortOptionChange(item: UIItem): void {
        this.searchParams.sortBy = item?.value;
        this.searchTrigger$.next(); 
    }

    handleToggleIsAscending(): void {
        this.searchParams.isAscending = !this.searchParams.isAscending;
        this.searchTrigger$.next(); 
    }
    
    handleMovieFiltersChange(newFilters: MovieFilters): void {
        this.movieFilters = newFilters;
        this.searchParams.page = 1;
        this.searchTrigger$.next(); 
    }

    handleCheckboxChange(id: number): void  {
        if(!this.movies?.results) return;

        const updatedResults = this.movies.results.map(movie => {
            if (movie.id === id) {
                return { ...movie, isSelected: !movie.isSelected }; 
            }
            return movie; 
        });
        this.movies = { ...this.movies, results: updatedResults };
    }

    selectAll(): void {
        if (!this.movies?.results) return;

        const updatedResults = this.movies.results.map(movie => ({ ...movie, isSelected: true }));
        this.movies = { ...this.movies, results: updatedResults };
    }

    deselectAll(): void {
        if (!this.movies?.results) return;

        const updatedResults = this.movies.results.map(movie => ({ ...movie, isSelected: false }));
        this.movies = { ...this.movies, results: updatedResults };
    }
    
    confirmImport(): void {
        if (!this.userId) return;

        this.fallbackState.isLoading = true;

        const moviesToImport = this.movies?.results.filter(movie => movie.isSelected);

        this.onMoviesImported.emit(moviesToImport);
    }

    closeDialog(): void {
        this.onCancelMoviesImport.emit();
    }

    faArrowUpWideShort = faArrowUpWideShort;
    faArrowDownShortWide = faArrowDownShortWide;
    faXmark = faXmark;
}
