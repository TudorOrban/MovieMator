import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDataDto } from '../../models/Movie';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FallbackState, initialFallbackState } from '../../../../shared/fallback/models/Fallback';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMapperService } from '../../../user/services/error-mapper.service';
import { LoadingFallbackComponent } from "../../../../shared/fallback/components/loading-fallback/loading-fallback.component";
import { ErrorFallbackComponent } from "../../../../shared/fallback/components/error-fallback/error-fallback.component";
import { AuthService } from '../../../../core/auth/service/auth.service';
import { UserDataDto } from '../../../user/models/User';

@Component({
    selector: 'app-movie',
    imports: [CommonModule, FontAwesomeModule, RouterModule, LoadingFallbackComponent, ErrorFallbackComponent],
    templateUrl: './movie.component.html',
})
export class MovieComponent implements OnInit, OnDestroy {
    movieId: number | null = null;
    movie: MovieDataDto | null = null;
    currentUser: UserDataDto | null = null;

    fallbackState: FallbackState = initialFallbackState;
    
    private subscription = new Subscription();

    constructor(
        private readonly movieService: MovieService,
        private readonly authService: AuthService,
        private readonly errorMapperService: ErrorMapperService,
        private readonly route: ActivatedRoute,
    ) {}
    
    ngOnInit(): void {
        this.subscription.add(
            this.route.paramMap.subscribe((params) => {
                this.movieId = Number(params.get("movieId"));

                this.loadCurrentUser();
                this.loadMovie();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private loadCurrentUser(): void {
        this.subscription.add(
            this.authService.currentUser$.subscribe({
                next: (data: UserDataDto | null) => {
                    this.currentUser = data;
                }
            })
        );
    }

    private loadMovie(): void {
        if (!this.movieId) return;

        this.fallbackState.isLoading = true;

        this.subscription.add(
            this.movieService.getMovieById(this.movieId).subscribe({
                next: (data) => {
                    this.movie = data;
                    this.fallbackState.isLoading = false;
                },
                error: (error) => this.handleAPIError(error)
            })
        );
    }
    
    private handleAPIError(error: HttpErrorResponse) {
        console.error("Error fetching movie: ", error);
        const { message, isForbidden } = this.errorMapperService.mapProfileError(error);
        this.fallbackState = { isLoading: false, errorMessage: message, isForbidden: isForbidden };
    }
    
    faEdit = faEdit;
    faSpinner = faSpinner;
}
