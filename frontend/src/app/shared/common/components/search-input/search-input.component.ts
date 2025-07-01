import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-search-input',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './search-input.component.html',
    styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
    faMagnifyingGlass = faMagnifyingGlass;
}
