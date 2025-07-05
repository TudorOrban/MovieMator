import { Routes } from '@angular/router';
import { MoviesComponent } from './features/movies/components/movies/movies.component';
import { AddMoviesComponent } from './features/movies/components/add-movies/add-movies.component';
import { MovieComponent } from './features/movies/components/movie/movie.component';
import { HomeComponent } from './core/main/components/home/home.component';
import { LogInComponent } from './core/auth/components/log-in/log-in.component';
import { SignUpComponent } from './core/auth/components/sign-up/sign-up.component';
import { UserProfileComponent } from './features/user-profile/components/user-profile/user-profile.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
    },
    {
        path: "login",
        component: LogInComponent,
    },
    {
        path: "signup",
        component: SignUpComponent
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
    },
    {
        path: "user-profile",
        component: UserProfileComponent
    }
];
