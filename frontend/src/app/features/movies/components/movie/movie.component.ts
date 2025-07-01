import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDataDto } from '../../models/Movie';

@Component({
    selector: 'app-movie',
    imports: [],
    templateUrl: './movie.component.html',
    styleUrl: './movie.component.css'
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
                console.log("Dat", data);
                this.movie = data;
            },
            error: (error) => {
                console.error("Error occurred fetching movie: ", error);
            }
        })
    }
}
