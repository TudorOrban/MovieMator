import { Component, signal } from '@angular/core';
import { CreateMovieDto } from '../../models/Movie';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-add-movies',
    imports: [CommonModule, FormsModule],
    templateUrl: './add-movies.component.html',
    styleUrl: './add-movies.component.css'
})
export class AddMoviesComponent {
    movie: CreateMovieDto = {
        userId: 1, // Placeholder
        tmdbId: -1,
        title: ""
    }
    hasBeenSubmitted = signal(false);

    constructor(
        private readonly movieService: MovieService,
        private readonly router: Router
    ) {}

    onSubmit(): void {
        this.hasBeenSubmitted.set(true);
        
        if (!this.movie.title) {
            return;
        }
        
        this.movieService.createMovie(this.movie).subscribe({
            next: (data) => {
                // this.toastService.addToast({ title: "Success", details: "Movie created successfully.", type: ToastType.SUCCESS });
                this.router.navigate([`/movies/${data?.id}`]);
            },
            error: (error) => {
                console.error("Failed to create movie:", error);
                // this.toastService.addToast({ title: "Error", details: "An error occurred creating movie.", type: ToastType.ERROR });
            }
        });
    }
}
