import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-search-input',
    imports: [CommonModule, FontAwesomeModule, FormsModule],
    templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
    @Output() onSearch = new EventEmitter<string>();

    searchText = signal("");

    search(): void {
        this.onSearch.emit(this.searchText());
    }
    
    faSearch = faSearch;
}
