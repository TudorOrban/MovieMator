import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MovieService } from '../../../../movies/services/movie.service';
import { MovieFilters, PageSearchConfiguration, SearchParams } from '../../../../../shared/models/Search';
import { AuthService } from '../../../../../core/auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from "../../../../../shared/common/components/search-input/search-input.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FiltersBarComponent } from "../../../../movies/components/movies/movies-header/filters-bar/filters-bar.component";
import { pagesSearchConfiguration } from '../../../../../core/main/config/pagesStandardConfig';
import { faArrowDownShortWide, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import { ToastManagerService } from '../../../../../shared/common/services/toast-manager.service';
import { FallbackState, initialFallbackState } from '../../../../../shared/fallback/models/Fallback';
import { MovieSmallDto } from '../../../../movies/models/Movie';
import { ToastType, UIItem } from '../../../../../shared/models/UI';
import { SelectorComponent } from "../../../../../shared/common/components/selector/selector.component";

@Component({
    selector: 'app-import-movies-dialog',
    imports: [CommonModule, SearchInputComponent, FontAwesomeModule, FiltersBarComponent, SelectorComponent],
    templateUrl: './import-movies-dialog.component.html',
    styleUrl: './import-movies-dialog.component.css'
})
export class ImportMoviesDialogComponent implements OnInit, OnDestroy {
    @Output() onMoviesImported = new EventEmitter<MovieSmallDto[]>();

    userId: number | null = null;
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

    constructor(
        private readonly movieService: MovieService,
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            this.authService.currentUser$.subscribe({
                next: (data) => {
                    this.userId = data?.id ?? null;
                }
            })
        )    
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    handleSearchTextChange(searchText: string): void {
        this.searchParams.searchText = searchText;
        this.searchParams.page = 1;
    }

    handleSortOptionChange(item: UIItem): void {
        this.searchParams.sortBy = item?.value;
    }

    handleToggleIsAscending(): void {
        this.searchParams.isAscending = !this.searchParams.isAscending;
    }
    
    handleMovieFiltersChange(newFilters: MovieFilters): void {
        this.movieFilters = newFilters;
        this.searchParams.page = 1;
    }

    confirmImport(): void {
        if (!this.userId) return;

        this.fallbackState.isLoading = true;

        this.subscription.add(
            this.movieService.searchSmallMovies(this.userId, this.searchParams, this.movieFilters).subscribe({
                next: (data) => {
                    this.onMoviesImported.emit(data.results);
                    this.toastService.addToast({ title: "Success", details: "Movies imported successfully.", type: ToastType.SUCCESS });
                },
                error: (error) => {
                    console.error("Failed to import movies: ", error);
                    this.toastService.addToast({ title: "Error", details: "An error occurred importing the movies.", type: ToastType.ERROR });
                }
            })
        )
    }

    faArrowUpWideShort = faArrowUpWideShort;
    faArrowDownShortWide = faArrowDownShortWide;
}
