import { Routes } from '@angular/router';
import { MoviesComponent } from './features/movies/components/movies/movies.component';
import { AddMovieComponent } from './features/movies/components/add-movie/add-movie.component';
import { MovieComponent } from './features/movies/components/movie/movie.component';
import { HomeComponent } from './core/main/components/home/home.component';
import { LogInComponent } from './core/auth/components/log-in/log-in.component';
import { SignUpComponent } from './core/auth/components/sign-up/sign-up.component';
import { UserProfileComponent } from './features/user/components/user-profile/user-profile.component';
import { EditProfileComponent } from './features/user/components/edit-profile/edit-profile.component';
import { SettingsComponent } from './features/user/components/settings/settings.component';
import { StatisticsComponent } from './features/statistics/components/statistics/statistics.component';
import { UpdateMovieComponent } from './features/movies/components/update-movie/update-movie.component';
import { AddMoviesComponent } from './features/movies/components/add-movies/add-movies.component';
import { ChangePasswordComponent } from './core/auth/components/change-password/change-password.component';
import { PrivacyPolicyComponent } from './core/main/components/compliance/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './core/main/components/compliance/terms-and-conditions/terms-and-conditions.component';
import { SearchPublicUsersComponent } from './features/user/components/search-public-users/search-public-users.component';

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
        component: MoviesComponent,
        data: { isCurrentUserMoviesPage: true }
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
        path: "user-profile/:userId",
        component: UserProfileComponent
    },
    {
        path: "user-profile/:userId/movies",
        component: MoviesComponent,
        data: { isCurrentUserMoviesPage: false } 
    },
    {
        path: "edit-profile",
        component: EditProfileComponent
    },
    {
        path: "search-public-users",
        component: SearchPublicUsersComponent
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
    { 
        path: "terms-and-conditions", 
        component: TermsAndConditionsComponent
    },
];
