import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FilterOption, FilterType, MovieFilters } from '../../../../../../shared/models/Search';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faCaretDown, faCaretUp, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { MovieStatus } from '../../../../models/Movie';
import { EnumSelectorComponent } from "../../../../../../shared/common/components/enum-selector/enum-selector.component";

@Component({
    selector: 'app-filters-bar',
    imports: [CommonModule, FontAwesomeModule, FormsModule, EnumSelectorComponent],
    templateUrl: './filters-bar.component.html',
    styleUrl: './filters-bar.component.css'
})
export class FiltersBarComponent implements OnInit , OnDestroy{
    @Input() movieFilters: MovieFilters = {};
    @Input() filterOptions: FilterOption[] = [];
    @Output() movieFiltersChanged = new EventEmitter<MovieFilters>();
    isExpanded: boolean = false;

    private directorChangeSubject = new Subject<string | null>();
    private directorSubscription!: Subscription;
    
    movieStatusOptions: { label: string, value: MovieStatus }[] = [
        { label: "Watched", value: MovieStatus.WATCHED },
        { label: "Watchlist", value: MovieStatus.WATCHLIST }
    ];

    ngOnInit(): void {
        this.directorSubscription = this.directorChangeSubject.pipe(
            debounceTime(500)
        ).subscribe(value => {
            this.movieFilters.director = value || undefined;
            this.emitFiltersChanged();
        });
    }

    ngOnDestroy(): void {
        if (this.directorSubscription) {
            this.directorSubscription.unsubscribe();
        }
    }

    toggleExpanded(): void {
        this.isExpanded = !this.isExpanded;
    }

    handleReleaseYearChange(value: string | null, type: "From" | "To"): void {
        this.movieFilters[type === "From" ? "releaseYearFrom" : "releaseYearTo"] = value ? Number(value) : undefined;
        this.emitFiltersChanged();
    }

    handleDirectorChange(value: string | null): void {
        this.directorChangeSubject.next(value);
    }

    handleUserRatingChange(value: string | null, type: "From" | "To"): void {
        this.movieFilters[type === "From" ? "userRatingFrom" : "userRatingTo"] = value ? Number(value) : undefined;
        this.emitFiltersChanged();
    }

    // New
    handleMovieStatusChange(value?: string): void {
        if (!value) {
            this.movieFilters.status = undefined;
            this.emitFiltersChanged();
            return;
        }

        this.movieFilters.status = MovieStatus[value as keyof typeof MovieStatus];
        this.emitFiltersChanged();
    }

    handleRuntimeChange(value: string | null, type: "lessThan" | "moreThan"): void {
        if (type === "lessThan") {
            this.movieFilters.runtimeMinutesLessThan = value ? Number(value) : undefined;
        } else {
            this.movieFilters.runtimeMinutesMoreThan = value ? Number(value) : undefined;
        }
        this.emitFiltersChanged();
    }

    handleGenresIncludingChange(value: string | undefined): void {
        this.movieFilters.genresIncluding = value
            ? value.split(',').map(genre => genre.trim()).filter(genre => genre.length > 0)
            : undefined;
        this.emitFiltersChanged();
    }

    handleActorsIncludingChange(value: string | undefined): void {
        this.movieFilters.actorsIncluding = value
            ? value.split(',').map(actor => actor.trim()).filter(actor => actor.length > 0)
            : undefined;
        this.emitFiltersChanged();
    }

    handleWatchedDateChange(value: string | null, type: "From" | "To"): void {
        if (type === "From") {
            this.movieFilters.watchedDateFrom = value || undefined;
        } else {
            this.movieFilters.watchedDateTo = value || undefined;
        }
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
            // New
            case "status":
                this.movieFilters.status = undefined;
                break;
            case "runtimeMinutes":
                this.movieFilters.runtimeMinutesLessThan = undefined;
                this.movieFilters.runtimeMinutesMoreThan = undefined;
                break;
            case "genresIncluding":
                this.movieFilters.genresIncluding = undefined;
                break;
            case "actorsIncluding":
                this.movieFilters.actorsIncluding = undefined;
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
        // New
        case "status":
                return this.movieFilters.status !== undefined && this.movieFilters.status !== null;
        case "runtimeMinutes":
            return (this.movieFilters.runtimeMinutesLessThan !== undefined && this.movieFilters.runtimeMinutesLessThan !== null) ||
                (this.movieFilters.runtimeMinutesMoreThan !== undefined && this.movieFilters.runtimeMinutesMoreThan !== null);
        case "genresIncluding":
            return (this.movieFilters.genresIncluding !== undefined && this.movieFilters.genresIncluding !== null &&
                    this.movieFilters.genresIncluding.some(g => g.trim().length > 0));
        case "actorsIncluding":
            return (this.movieFilters.actorsIncluding !== undefined && this.movieFilters.actorsIncluding !== null &&
                    this.movieFilters.actorsIncluding.some(a => a.trim().length > 0));
        default:
            return false;
    }
}

    public readonly FilterType = FilterType;
    public readonly MovieStatus = MovieStatus;

    faTimesCircle = faTimesCircle;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
}
