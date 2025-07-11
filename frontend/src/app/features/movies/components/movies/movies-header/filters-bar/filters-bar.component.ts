import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FilterOption, FilterType, MovieFilters } from '../../../../../../shared/models/Search';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faCaretDown, faCaretUp, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
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

    private releaseYearFromChangeSubject = new Subject<number | null>();
    private releaseYearToChangeSubject = new Subject<number | null>();
    private directorChangeSubject = new Subject<string | null>();
    private userRatingFromChangeSubject = new Subject<number | null>();
    private userRatingToChangeSubject = new Subject<number | null>();
    private watchedDateFromChangeSubject = new Subject<string | null>();
    private watchedDateToChangeSubject = new Subject<string | null>();
    private runtimeLessThanChangeSubject = new Subject<number | null>();
    private runtimeMoreThanChangeSubject = new Subject<number | null>();
    private genresIncludingChangeSubject = new Subject<string[] | undefined>(); 
    private actorsIncludingChangeSubject = new Subject<string[] | undefined>(); 

    private subscriptions: Subscription = new Subscription();
    
    movieStatusOptions: { label: string, value: MovieStatus }[] = [
        { label: "Watched", value: MovieStatus.WATCHED },
        { label: "Watchlist", value: MovieStatus.WATCHLIST }
    ];

    ngOnInit(): void {
        const debounceTimeMs = 500;
        
        // Release Year From
        this.subscriptions.add(this.releaseYearFromChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.releaseYearFrom = value ?? undefined;
            this.emitFiltersChanged();
        }));

        // Release Year To
        this.subscriptions.add(this.releaseYearToChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.releaseYearTo = value ?? undefined;
            this.emitFiltersChanged();
        }));

        // Director
        this.subscriptions.add(this.directorChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.director = value || undefined;
            this.emitFiltersChanged();
        }));

        // User Rating From
        this.subscriptions.add(this.userRatingFromChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.userRatingFrom = value ?? undefined;
            this.emitFiltersChanged();
        }));

        // User Rating To
        this.subscriptions.add(this.userRatingToChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.userRatingTo = value ?? undefined;
            this.emitFiltersChanged();
        }));

        // Watched Date From
        this.subscriptions.add(this.watchedDateFromChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.watchedDateFrom = value || undefined;
            this.emitFiltersChanged();
        }));

        // Watched Date To
        this.subscriptions.add(this.watchedDateToChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.watchedDateTo = value || undefined;
            this.emitFiltersChanged();
        }));

        // Runtime Less Than
        this.subscriptions.add(this.runtimeLessThanChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.runtimeMinutesLessThan = value ?? undefined;
            this.emitFiltersChanged();
        }));

        // Runtime More Than
        this.subscriptions.add(this.runtimeMoreThanChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged()
        ).subscribe(value => {
            this.movieFilters.runtimeMinutesMoreThan = value ?? undefined;
            this.emitFiltersChanged();
        }));

        this.subscriptions.add(this.genresIncludingChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged((prev, curr) => {
                const prevStr = prev ? JSON.stringify([...prev].sort()) : '';
                const currStr = curr ? JSON.stringify([...curr].sort()) : '';
                return prevStr === currStr;
            })
        ).subscribe(value => {
            this.movieFilters.genresIncluding = value?.filter(g => g.trim().length > 0) || undefined;
            this.emitFiltersChanged();
        }));

        this.subscriptions.add(this.actorsIncludingChangeSubject.pipe(
            debounceTime(debounceTimeMs),
            distinctUntilChanged((prev, curr) => {
                const prevStr = prev ? JSON.stringify([...prev].sort()) : '';
                const currStr = curr ? JSON.stringify([...curr].sort()) : '';
                return prevStr === currStr;
            })
        ).subscribe(value => {
            this.movieFilters.actorsIncluding = value?.filter(a => a.trim().length > 0) || undefined;
            this.emitFiltersChanged();
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    toggleExpanded(): void {
        this.isExpanded = !this.isExpanded;
    }

    handleReleaseYearChange(value: string | null, type: "From" | "To"): void {
        const numValue = value ? Number(value) : null;
        if (type === "From") {
            this.releaseYearFromChangeSubject.next(numValue);
        } else {
            this.releaseYearToChangeSubject.next(numValue);
        }
    }

    handleDirectorChange(value: string | null): void {
        this.directorChangeSubject.next(value);
    }

    handleUserRatingChange(value: string | null, type: "From" | "To"): void {
        const numValue = value ? Number(value) : null;
        if (type === "From") {
            this.userRatingFromChangeSubject.next(numValue);
        } else {
            this.userRatingToChangeSubject.next(numValue);
        }
    }

    handleMovieStatusChange(value?: string): void {
        if (!value) {
            this.movieFilters.status = undefined;
        } else {
            this.movieFilters.status = MovieStatus[value as keyof typeof MovieStatus];
        }
        this.emitFiltersChanged();
    }

    handleRuntimeChange(value: string | null, type: "lessThan" | "moreThan"): void {
        const numValue = value ? Number(value) : null;
        if (type === "lessThan") {
            this.runtimeLessThanChangeSubject.next(numValue);
        } else {
            this.runtimeMoreThanChangeSubject.next(numValue);
        }
    }

    handleGenresChange(genres: string[] | undefined): void {
        this.genresIncludingChangeSubject.next(genres);
    }

    handleActorsChange(actors: string[] | undefined): void {
        this.actorsIncludingChangeSubject.next(actors);
    }

    handleWatchedDateChange(value: string | null, type: "From" | "To"): void {
        if (type === "From") {
            this.watchedDateFromChangeSubject.next(value);
        } else {
            this.watchedDateToChangeSubject.next(value);
        }
    }
    
    clearFilter(filterKey: string): void {
        switch (filterKey) {
            case "releaseYear":
                this.movieFilters.releaseYearFrom = undefined;
                this.movieFilters.releaseYearTo = undefined;
                this.releaseYearFromChangeSubject.next(null); 
                this.releaseYearToChangeSubject.next(null);   
                break;
            case "director":
                this.movieFilters.director = undefined;
                this.directorChangeSubject.next(null); 
                break;
            case "userRating":
                this.movieFilters.userRatingFrom = undefined;
                this.movieFilters.userRatingTo = undefined;
                this.userRatingFromChangeSubject.next(null); 
                this.userRatingToChangeSubject.next(null);   
                break;
            case "watchedDate":
                this.movieFilters.watchedDateFrom = undefined;
                this.movieFilters.watchedDateTo = undefined;
                this.watchedDateFromChangeSubject.next(null); 
                this.watchedDateToChangeSubject.next(null);   
                break;
            case "status": 
                this.movieFilters.status = undefined;
                break;
            case "runtimeMinutes":
                this.movieFilters.runtimeMinutesLessThan = undefined;
                this.movieFilters.runtimeMinutesMoreThan = undefined;
                this.runtimeLessThanChangeSubject.next(null); 
                this.runtimeMoreThanChangeSubject.next(null);   
                break;
            case "genresIncluding":
                this.movieFilters.genresIncluding = undefined;
                this.genresIncludingChangeSubject.next(undefined); 
                break;
            case "actorsIncluding":
                this.movieFilters.actorsIncluding = undefined;
                this.actorsIncludingChangeSubject.next(undefined); 
                break;
        }
        this.emitFiltersChanged();
    }

    clearAllFilters(): void {
        this.movieFilters = {};
        this.releaseYearFromChangeSubject.next(null);
        this.releaseYearToChangeSubject.next(null);
        this.directorChangeSubject.next(null);
        this.userRatingFromChangeSubject.next(null);
        this.userRatingToChangeSubject.next(null);
        this.watchedDateFromChangeSubject.next(null);
        this.watchedDateToChangeSubject.next(null);
        this.runtimeLessThanChangeSubject.next(null);
        this.runtimeMoreThanChangeSubject.next(null);
        this.genresIncludingChangeSubject.next(undefined);
        this.actorsIncludingChangeSubject.next(undefined);

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
