import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faArrowUpWideShort, faArrowDownShortWide, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SearchInputComponent } from "../../../../../shared/common/components/search-input/search-input.component";
import { MovieFilters, PageSearchConfiguration, SearchParams } from '../../../../../shared/models/Search';
import { pagesSearchConfiguration } from '../../../../../core/main/config/pagesStandardConfig';
import { UIItem } from '../../../../../shared/models/UI';
import { RouterModule } from '@angular/router';
import { SelectorComponent } from "../../../../../shared/common/components/selector/selector.component";
import { FiltersBarComponent } from "./filters-bar/filters-bar.component";

@Component({
    selector: 'app-movies-header',
    imports: [CommonModule, RouterModule, FontAwesomeModule, SearchInputComponent, SelectorComponent, FiltersBarComponent],
    templateUrl: './movies-header.component.html',
    styleUrl: './movies-header.component.css'
})
export class MoviesHeaderComponent {
    @Input() searchParams!: SearchParams;
    @Input() totalCount?: number = 0;
    @Input() movieFilters: MovieFilters = {};
    @Input() isDeleteModeOn: boolean = false;
    @Output() searchParamsChanged = new EventEmitter<void>();
    @Output() sortOptionsChanged = new EventEmitter<void>();
    @Output() movieFiltersChanged = new EventEmitter<MovieFilters>();
    @Output() deleteModeToggled = new EventEmitter<void>();
    @Output() onDeleteMovies = new EventEmitter<void>();
    @Output() cancelDeleteMovies = new EventEmitter<void>();

    searchConfig: PageSearchConfiguration = pagesSearchConfiguration.pagesConfig["/movies"];

    handleSearchTextChange(searchText: string): void {
        this.searchParams.searchText = searchText;
        this.searchParamsChanged.emit();
    }

    handleSortOptionChange(item: UIItem): void {
        this.searchParams.sortBy = item?.value;
        this.sortOptionsChanged.emit();
        this.searchParamsChanged.emit();
    }

    handleToggleIsAscending(): void {
        this.searchParams.isAscending = !this.searchParams.isAscending;
        this.searchParamsChanged.emit();
    }

    handleMovieFiltersChange(newFilters: MovieFilters) {
        this.movieFilters = newFilters;
        this.movieFiltersChanged.emit(newFilters);
    }

    handleToggleDeleteMode(): void {
        this.deleteModeToggled.emit();
    }

    handleCancelDeleteMovies(): void {
        this.cancelDeleteMovies.emit();
    }

    deleteMovies(): void {
        this.onDeleteMovies.emit();
    }

    faPlus = faPlus;
    faArrowUpWideShort = faArrowUpWideShort;
    faArrowDownShortWide = faArrowDownShortWide;
    faTrash = faTrash;
    faCheck = faCheck;
    faTimes = faTimes;
}
