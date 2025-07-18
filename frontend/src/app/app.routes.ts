import { Routes } from '@angular/router';
import { MoviesComponent } from './features/movies/components/movies/movies.component';
import { AddMovieComponent } from './features/movies/components/add-movie/add-movie.component';
import { MovieComponent } from './features/movies/components/movie/movie.component';
import { HomeComponent } from './core/main/components/home/home.component';
import { LogInComponent } from './core/auth/components/log-in/log-in.component';
import { SignUpComponent } from './core/auth/components/sign-up/sign-up.component';
import { UserProfileComponent } from './features/user-profile/components/user-profile/user-profile.component';
import { EditProfileComponent } from './features/user-profile/components/edit-profile/edit-profile.component';
import { SettingsComponent } from './features/user-profile/components/settings/settings.component';
import { StatisticsComponent } from './features/statistics/components/statistics/statistics.component';
import { UpdateMovieComponent } from './features/movies/components/update-movie/update-movie.component';
import { AddMoviesComponent } from './features/movies/components/add-movies/add-movies.component';
import { ChangePasswordComponent } from './core/auth/components/change-password/change-password.component';
import { PrivacyPolicyComponent } from './core/main/components/privacy-policy/privacy-policy.component';

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
        component: AddMoviesComponent,
    },
    {
        path: "movies/update-movie/:movieId",
        component: UpdateMovieComponent
    },
    {
        path: "movies/:movieId",
        component: MovieComponent
    },
    { 
        path: "statistics", 
        component: StatisticsComponent 
    },
    {
        path: "user-profile",
        component: UserProfileComponent
    },
    {
        path: "edit-profile",
        component: EditProfileComponent
    },
    {
        path: "settings",
        component: SettingsComponent
    },
    {
        path: "change-password",
        component: ChangePasswordComponent
    },
    { 
        path: "privacy-policy", 
        component: PrivacyPolicyComponent 
    },
];
