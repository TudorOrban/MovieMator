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
import { AuthGuard } from './core/auth/guards/auth.guard';
import { RankingsComponent } from './features/rankings/components/rankings/rankings.component';
import { AddRankingComponent } from './features/rankings/components/add-ranking/add-ranking.component';
import { RankingComponent } from './features/rankings/components/ranking/ranking.component';

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
        path: "privacy-policy", 
        component: PrivacyPolicyComponent
    },
    { 
        path: "terms-and-conditions", 
        component: TermsAndConditionsComponent
    },
    { 
        path: "movies", 
        component: MoviesComponent,
        data: { isCurrentUserMoviesPage: true },
        canActivate: [AuthGuard]
    },
    {
        path: "movies/add-movies",
        component: AddMoviesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "movies/update-movie/:movieId",
        component: UpdateMovieComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "movies/:movieId",
        component: MovieComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: "rankings", 
        component: RankingsComponent,
        data: { isCurrentUserRankingsPage: true },
        canActivate: [AuthGuard]
    },
    {
        path: "rankings/add-ranking",
        component: AddRankingComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "rankings/:rankingId",
        component: RankingComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: "statistics", 
        component: StatisticsComponent ,
        canActivate: [AuthGuard]
    },
    {
        path: "user-profile/:userId",
        component: UserProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "user-profile/:userId/movies",
        component: MoviesComponent,
        data: { isCurrentUserMoviesPage: false } ,
        canActivate: [AuthGuard]
    },
    {
        path: "edit-profile",
        component: EditProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "search-public-users",
        component: SearchPublicUsersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "settings",
        component: SettingsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "change-password",
        component: ChangePasswordComponent,
        canActivate: [AuthGuard]
    },
];
