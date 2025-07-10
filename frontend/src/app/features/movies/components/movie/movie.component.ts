import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDataDto } from '../../models/Movie';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-movie',
    imports: [CommonModule],
    templateUrl: './movie.component.html',
})
export class MovieComponent {
    movieId?: number;
    movie?: MovieDataDto;

    constructor(
        private readonly movieService: MovieService,
        private readonly route: ActivatedRoute,
    ) {}
    
    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.movieId = Number(params.get("movieId"));

            this.loadMovie();
        });
    }

    private loadMovie(): void {
        if (!this.movieId) return;

        this.movieService.getMovieById(this.movieId).subscribe({
            next: (data) => {
                this.movie = data;
            },
            error: (error) => {
                console.error("Error occurred fetching movie: ", error);
            }
        })
    }
}
