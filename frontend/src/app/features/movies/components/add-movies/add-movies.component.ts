import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CreateMovieDto, CreateMovieDtoUi, MovieStatus } from '../../models/Movie';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { debounceTime, distinctUntilChanged, of, Subject, Subscription, switchMap } from 'rxjs';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';
import { EnumSelectorComponent } from "../../../../shared/common/components/enum-selector/enum-selector.component";
import { TagInputComponent } from "../../../../shared/common/components/tag-input/tag-input.component";
import { TmdbMovieCredits, TmdbMovieDetails, TmdbMovieResult } from '../../models/Tmdb';
import { TmdbService } from '../../services/tmdb.service';
import { faCaretDown, faCaretUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-add-movies',
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule, EnumSelectorComponent, TagInputComponent],
    templateUrl: './add-movies.component.html',
})
export class AddMoviesComponent implements OnInit, OnDestroy {
    userId: number = -1;
    movies: CreateMovieDtoUi[] = []; 

    hasBeenSubmitted = signal(false);

    movieStatusOptions: { label: string, value: MovieStatus }[] = [
        { label: "Watched", value: MovieStatus.WATCHED },
        { label: "Watchlist", value: MovieStatus.WATCHLIST }
    ];

    private mainSubscription: Subscription = new Subscription();

    constructor(
        private readonly movieService: MovieService,
        readonly tmdbService: TmdbService,
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
        private readonly router: Router
    ) {}

    ngOnInit() {
        this.addMovie();

        this.mainSubscription.add(this.authService.currentUser$.subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }
                this.userId = data.id;
                this.movies.forEach(movie => movie.userId = this.userId);
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
                this.router.navigate(["/signup"]);
            }
        }));
    }

    ngOnDestroy(): void {
        this.mainSubscription.unsubscribe();
        this.movies.forEach(movie => {
            if (movie.searchSubscription) {
                movie.searchSubscription.unsubscribe();
            }
        });
    }

    private createNewMovieUi(): CreateMovieDtoUi {
        const newMovie: CreateMovieDtoUi = {
            userId: this.userId,
            tmdbId: -1,
            title: "",
            status: MovieStatus.WATCHED,
            areMovieDetailsExpanded: false,
            areUserDetailsExpanded: true,
            tmdbSearchResults: [],
            searchTerms: new Subject<string>(),
            isTitleUnique: true,
            watchedDates: [] 
        };

        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        newMovie.watchedDates!.push(`${year}-${month}-${day}`);

        // Search movies on TMDB
        newMovie.searchSubscription = newMovie.searchTerms.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) => {
                if (term.trim()) {
                    return this.tmdbService.searchMovies(term);
                } else {
                    return of([]);
                }
            })
        ).subscribe({
            next: (results: TmdbMovieResult[]) => {
                newMovie.tmdbSearchResults = results;
            },
            error: (error) => {
                console.error("Error searching TMDB:", error);
                this.toastService.addToast({ title: "Error", details: "Failed to search TMDB.", type: ToastType.ERROR });
            }
        });

        return newMovie;
    }

    addMovie(): void {
        this.movies.push(this.createNewMovieUi());
    }

    removeMovie(index: number): void {
        if (this.movies[index].searchSubscription) {
            this.movies[index].searchSubscription?.unsubscribe();
        }
        this.movies.splice(index, 1);
    }

    onSubmit(): void { 
        this.hasBeenSubmitted.set(true);

        let allFormsValid = true;
        for (const movie of this.movies) {
            console.log("SA", movie.watchedDates);
            if (!movie.userId || !movie.title || !movie.isTitleUnique) {
                allFormsValid = false;
                this.toastService.addToast({ title: "Validation Error", details: `Please ensure all required fields for movie "${movie.title || 'untitled'}" are filled correctly.`, type: ToastType.ERROR });
            }
        }

        if (!allFormsValid) {
            return;
        }

        const moviesToCreate: CreateMovieDto[] = this.movies.map(movieUi => {
            const { areMovieDetailsExpanded: areDetailsExpanded, tmdbSearchResults, searchTerms, searchSubscription, ...rest } = movieUi;
            return rest;
        });

        if (moviesToCreate.length === 0) {
            this.toastService.addToast({ title: "No Movies to Add", details: "Please add at least one movie.", type: ToastType.INFO });
            return;
        }

        this.movieService.createMovies(moviesToCreate).subscribe({
            next: (data) => {
                this.toastService.addToast({ title: "Success", details: "Movies added successfully.", type: ToastType.SUCCESS });
                this.router.navigate(["/movies"]);
            },
            error: (error) => {
                console.error("Failed to create movies:", error);
                this.toastService.addToast({ title: "Error", details: "An error occurred adding movies.", type: ToastType.ERROR });
            }
        });
    }

    handleMovieStatusChange(index: number, value?: string): void {
        if (!value) {
            this.movies[index].status = undefined;
            return;
        }
        this.movies[index].status = MovieStatus[value as keyof typeof MovieStatus];
    }

    addWatchedDate(movieIndex: number): void {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        this.movies[movieIndex].watchedDates!.push(`${year}-${month}-${day}`);
    }

    removeWatchedDate(movieIndex: number, dateIndex: number): void {
        this.movies[movieIndex].watchedDates!.splice(dateIndex, 1);
    }

    onWatchedDateChange(movieIndex: number, dateIndex: number, newValue: string): void {
        this.movies[movieIndex].watchedDates![dateIndex] = newValue;
    }

    handleGenresChange(index: number, genres: string[] | undefined): void {
        this.movies[index].genres = genres;
    }

    handleActorsChange(index: number, actors: string[] | undefined): void {
        this.movies[index].actors = actors;
    }

    getCurrentYear(): number {
        return new Date().getFullYear();
    }

    onTitleInput(index: number, event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.movies[index].title = inputElement.value;
        this.movies[index].searchTerms.next(inputElement.value); 
    }

    selectMovie(index: number, selectedMovie: TmdbMovieResult): void {
        const movie = this.movies[index];
        movie.tmdbId = selectedMovie.id;
        movie.title = selectedMovie.title;
        movie.tmdbSearchResults = [];

        this.mainSubscription.add(this.movieService.isMovieTitleUnique(this.userId, movie.title).subscribe({
            next: (isMovieTitleUnique: boolean) => {
                movie.isTitleUnique = isMovieTitleUnique;
            }
        }))

        this.mainSubscription.add(this.tmdbService.getMovieDetails(selectedMovie.id).subscribe({
            next: (details: TmdbMovieDetails) => {
                movie.releaseYear = details.release_date ? parseInt(details.release_date.substring(0, 4)) : undefined;
                movie.posterUrl = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : undefined;
                movie.plotSummary = details.overview || undefined;
                movie.runtimeMinutes = details.runtime || undefined;
                movie.genres = details.genres?.map(genre => genre.name) || undefined;
            },
            error: (error) => {
                console.error("Error fetching movie details: ", error);
                this.toastService.addToast({ title: "Error", details: "Failed to fetch movie details from TMDB.", type: ToastType.ERROR });
            }
        }));
        this.mainSubscription.add(this.tmdbService.getMovieCredits(selectedMovie.id).subscribe({
            next: (credits: TmdbMovieCredits) => {
                const director = credits.crew.find(person => person.job === "Director");
                movie.director = director ? director.name : undefined;
                movie.actors = credits.cast.slice(0, 5).map(actor => actor.name);
            },
            error: (error) => {
                console.error("Error fetching movie credits:", error);
                this.toastService.addToast({ title: "Error", details: "Failed to fetch movie credits from TMDB.", type: ToastType.ERROR });
            }
        }));
    }

    toggleIsMovieDetailsExpanded(index: number): void {
        this.movies[index].areMovieDetailsExpanded = !this.movies[index].areMovieDetailsExpanded;
    }

    toggleIsUserDetailsExpanded(index: number): void {
        this.movies[index].areUserDetailsExpanded = !this.movies[index].areUserDetailsExpanded;
    }

    MovieStatus = MovieStatus;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
    faPlus = faPlus;
    faTrash = faTrash;
}