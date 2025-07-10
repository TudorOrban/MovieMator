import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CreateMovieDto, MovieStatus } from '../../models/Movie';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { Subscription } from 'rxjs';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ToastType } from '../../../../shared/models/UI';
import { EnumSelectorComponent } from "../../../../shared/common/components/enum-selector/enum-selector.component";
import { TagInputComponent } from "../../../../shared/common/components/tag-input/tag-input.component";

@Component({
    selector: 'app-add-movies',
    imports: [CommonModule, FormsModule, EnumSelectorComponent, TagInputComponent],
    templateUrl: './add-movies.component.html',
})
export class AddMoviesComponent implements OnInit, OnDestroy {
    movie: CreateMovieDto = {
        userId: -1,
        tmdbId: -1,
        title: ""
    }
    hasBeenSubmitted = signal(false);

    movieStatusOptions: { label: string, value: MovieStatus }[] = [
        { label: 'Watched', value: MovieStatus.WATCHED },
        { label: 'Watchlist', value: MovieStatus.WATCHLIST }
    ];

    private subscription: Subscription = new Subscription();

    constructor(
        private readonly movieService: MovieService,
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
        private readonly router: Router
    ) {}

    ngOnInit() {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (data) => {
                if (!data) {
                    this.router.navigate(["/signup"]);
                    return;
                }
                this.movie.userId = data?.id;
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
                this.router.navigate(["/signup"]);
            }
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmit(): void {
        this.hasBeenSubmitted.set(true);
        
        if (!this.movie.userId || !this.movie.title) {
            console.error("Missing userId or title");
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
}
