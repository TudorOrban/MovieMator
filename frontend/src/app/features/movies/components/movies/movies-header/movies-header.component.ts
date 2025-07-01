import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faArrowUpWideShort, faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import { SearchInputComponent } from "../../../../../shared/common/components/search-input/search-input.component";

@Component({
    selector: 'app-movies-header',
    imports: [CommonModule, FontAwesomeModule, SearchInputComponent],
    templateUrl: './movies-header.component.html',
    styleUrl: './movies-header.component.css'
})
export class MoviesHeaderComponent {
    faPlus = faPlus;
    faArrowUpWideShort = faArrowUpWideShort;
    faArrowDownShortWide = faArrowDownShortWide;

    constructor(
        private router: Router
    ) {}

    handleAddMovie() {
        this.router.navigate(["/movie/add-movie"]);
    }
}
