import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDataDto } from '../../models/Movie';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-movie',
    imports: [CommonModule, FontAwesomeModule, RouterModule],
    templateUrl: './movie.component.html',
})
export class MovieComponent implements OnInit, OnDestroy {
    movieId?: number;
    movie?: MovieDataDto;
    isLoading: boolean = false;

    private subscription = new Subscription();

    constructor(
        private readonly movieService: MovieService,
        private readonly route: ActivatedRoute,
    ) {}
    
    ngOnInit(): void {
        this.subscription.add(
            this.route.paramMap.subscribe((params) => {
                this.movieId = Number(params.get("movieId"));

                this.loadMovie();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private loadMovie(): void {
        if (!this.movieId) return;

        this.isLoading = true;

        this.subscription.add(
            this.movieService.getMovieById(this.movieId).subscribe({
                next: (data) => {
                    this.movie = data;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error("Error occurred fetching movie: ", error);
                    this.isLoading = false;
                }
            })
        );
    }
    
    faEdit = faEdit;
    faSpinner = faSpinner;
}
