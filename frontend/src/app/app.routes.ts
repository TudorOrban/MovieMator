import { Routes } from '@angular/router';
import { MoviesComponent } from './features/movies/components/movies/movies.component';
import { AddMoviesComponent } from './features/movies/components/add-movies/add-movies.component';

export const routes: Routes = [
    { 
        path: "movies", 
        component: MoviesComponent 
    },
    {
        path: "movies/add-movies",
        component: AddMoviesComponent
    },
];
