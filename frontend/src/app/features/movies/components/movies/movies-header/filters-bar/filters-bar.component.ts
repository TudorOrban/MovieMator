import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterOption, FilterType, MovieFilters } from '../../../../../../shared/models/Search';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faCaretDown, faCaretUp, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-filters-bar',
    imports: [CommonModule, FontAwesomeModule, FormsModule],
    templateUrl: './filters-bar.component.html',
    styleUrl: './filters-bar.component.css'
})
export class FiltersBarComponent {
    @Input() movieFilters: MovieFilters = {};
    @Input() filterOptions: FilterOption[] = [];
    @Output() movieFiltersChanged = new EventEmitter<MovieFilters>();
    isExpanded: boolean = false;

    toggleExpanded(): void {
        this.isExpanded = !this.isExpanded;
    }

    handleReleaseYearChange(value: string | null, type: "From" | "To"): void {
        this.movieFilters[type === "From" ? "releaseYearFrom" : "releaseYearTo"] = value ? Number(value) : undefined;
        this.emitFiltersChanged();
    }

    handleDirectorChange(value: string | null): void {
        this.movieFilters.director = value || undefined;
        this.emitFiltersChanged();
    }

    handleUserRatingChange(value: string | null, type: "From" | "To"): void {
        this.movieFilters[type === "From" ? "userRatingFrom" : "userRatingTo"] = value ? Number(value) : undefined;
        this.emitFiltersChanged();
    }

    handleWatchedDateChange(value: string | null, type: "From" | "To"): void {
        this.movieFilters[type === "From" ? "watchedDateFrom" : "watchedDateTo"] = value ? new Date(value) : undefined;
        this.emitFiltersChanged();
    }
    
    clearFilter(filterKey: string): void {
        switch (filterKey) {
            case "releaseYear":
                this.movieFilters.releaseYearFrom = undefined;
                this.movieFilters.releaseYearTo = undefined;
                break;
            case "director":
                this.movieFilters.director = undefined;
                break;
            case "userRating":
                this.movieFilters.userRatingFrom = undefined;
                this.movieFilters.userRatingTo = undefined;
                break;
            case "watchedDate":
                this.movieFilters.watchedDateFrom = undefined;
                this.movieFilters.watchedDateTo = undefined;
                break;
        }
        this.emitFiltersChanged();
    }

    clearAllFilters(): void {
        this.movieFilters = {};
        this.emitFiltersChanged();
    }

    private emitFiltersChanged(): void {
        this.movieFiltersChanged.emit({ ...this.movieFilters });
    }

    isFilterActive(filterKey: string): boolean {
    switch (filterKey) {
        case "releaseYear":
            return (this.movieFilters.releaseYearFrom !== undefined && this.movieFilters.releaseYearFrom !== null) ||
                   (this.movieFilters.releaseYearTo !== undefined && this.movieFilters.releaseYearTo !== null);
        case "director":
            return (this.movieFilters.director !== undefined && this.movieFilters.director !== null && this.movieFilters.director !== "");
        case "userRating":
            return (this.movieFilters.userRatingFrom !== undefined && this.movieFilters.userRatingFrom !== null) ||
                   (this.movieFilters.userRatingTo !== undefined && this.movieFilters.userRatingTo !== null);
        case "watchedDate":
            return (this.movieFilters.watchedDateFrom !== undefined && this.movieFilters.watchedDateFrom !== null) ||
                   (this.movieFilters.watchedDateTo !== undefined && this.movieFilters.watchedDateTo !== null);
        default:
            return false;
    }
}

    public readonly FilterType = FilterType;

    faTimesCircle = faTimesCircle;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
}
