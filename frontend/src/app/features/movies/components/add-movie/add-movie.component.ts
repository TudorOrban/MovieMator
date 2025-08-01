import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CreateMovieDto, MovieStatus } from '../../models/Movie';
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
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-add-movie',
    imports: [CommonModule, FormsModule, FontAwesomeModule, EnumSelectorComponent, TagInputComponent],
    templateUrl: './add-movie.component.html',
})
export class AddMovieComponent implements OnInit, OnDestroy {
    movie: CreateMovieDto = {
        userId: -1,
        tmdbId: -1,
        title: "",
        status: MovieStatus.WATCHED
    }
    hasBeenSubmitted = signal(false);

    movieStatusOptions: { label: string, value: MovieStatus }[] = [
        { label: "Watched", value: MovieStatus.WATCHED },
        { label: "Watchlist", value: MovieStatus.WATCHLIST }
    ];
    isMovieDetailsExpanded = signal(false);

    tmdbSearchResults: TmdbMovieResult[] = [];
    private searchTerms = new Subject<string>();
    private subscription: Subscription = new Subscription();

    constructor(
        private readonly movieService: MovieService,
        readonly tmdbService: TmdbService,
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
        private readonly router: Router
    ) {}

    ngOnInit() {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }
                this.movie.userId = data?.id;
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
            }
        });
        this.subscription.add(this.searchTerms.pipe(
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
                this.tmdbSearchResults = results;
            },
            error: (error) => {
                console.error("Error searching TMDB:", error);
                this.toastService.addToast({ title: "Error", details: "Failed to search TMDB.", type: ToastType.ERROR });
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmit(): void {
        this.hasBeenSubmitted.set(true);
        
        if (!this.movie.userId || !this.movie.title) {
            console.error("Missing userId or title");
            this.toastService.addToast({ title: "Validation Error", details: "Movie title and user ID are required.", type: ToastType.ERROR });
            return;
        }
        
        this.movieService.createMovie(this.movie).subscribe({
            next: (data) => {
                this.toastService.addToast({ title: "Success", details: "Movie created successfully.", type: ToastType.SUCCESS });
                this.router.navigate([`/movies/${data?.id}`]);
            },
            error: (error) => {
                console.error("Failed to create movie:", error);
                this.toastService.addToast({ title: "Error", details: "An error occurred creating movie.", type: ToastType.ERROR });
            }
        });
    }

    handleMovieStatusChange(value?: string): void {
        if (!value) {
            this.movie.status = undefined;
            return;
        }
        this.movie.status = MovieStatus[value as keyof typeof MovieStatus];
    }

    handleGenresChange(genres: string[] | undefined): void {
        this.movie.genres = genres;
    }

    handleActorsChange(actors: string[] | undefined): void {
        this.movie.actors = actors;
    }

    getCurrentYear(): number {
        return new Date().getFullYear();
    }

    onTitleInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.searchTerms.next(inputElement.value);
        this.movie.title = inputElement.value;
    }

    selectMovie(selectedMovie: TmdbMovieResult): void {
        this.movie.tmdbId = selectedMovie.id;
        this.movie.title = selectedMovie.title;
        this.tmdbSearchResults = [];

        this.subscription.add(this.tmdbService.getMovieDetails(selectedMovie.id).subscribe({
            next: (details: TmdbMovieDetails) => {
                this.movie.releaseYear = details.release_date ? parseInt(details.release_date.substring(0, 4)) : undefined;
                this.movie.posterUrl = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : undefined;
                this.movie.plotSummary = details.overview || undefined;
                this.movie.runtimeMinutes = details.runtime || undefined;
                this.movie.genres = details.genres?.map(genre => genre.name) || undefined;
            },
            error: (error) => {
                console.error("Error fetching movie details: ", error);
                this.toastService.addToast({ title: "Error", details: "Failed to fetch movie details from TMDB.", type: ToastType.ERROR });
            }
        }));
        this.subscription.add(this.tmdbService.getMovieCredits(selectedMovie.id).subscribe({
            next: (credits: TmdbMovieCredits) => {
                const director = credits.crew.find(person => person.job === 'Director');
                this.movie.director = director ? director.name : undefined;
                this.movie.actors = credits.cast.slice(0, 5).map(actor => actor.name); // Get top 5 actors
            },
            error: (error) => {
                console.error("Error fetching movie credits:", error);
                this.toastService.addToast({ title: "Error", details: "Failed to fetch movie credits from TMDB.", type: ToastType.ERROR });
            }
        }));
    }

    toggleIsMovieDetailsExpanded(): void {
        this.isMovieDetailsExpanded.set(!this.isMovieDetailsExpanded());
    }

    MovieStatus = MovieStatus;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
}
