import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilm, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './home.component.html',
})
export class HomeComponent {

    faPlus = faPlus;
    faFilm = faFilm;
}
