import { Routes } from '@angular/router';
import { MoviesComponent } from './features/movies/components/movies/movies.component';
import { AddMoviesComponent } from './features/movies/components/add-movies/add-movies.component';
import { MovieComponent } from './features/movies/components/movie/movie.component';
import { HomeComponent } from './core/main/components/home/home.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
    },
    { 
        path: "movies", 
        component: MoviesComponent 
    },
    {
        path: "movies/add-movies",
        component: AddMoviesComponent
    },
    {
        path: "movies/:movieId",
        component: MovieComponent
    }
];
