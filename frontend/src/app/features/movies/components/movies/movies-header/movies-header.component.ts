import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faArrowUpWideShort, faArrowDownShortWide, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { SearchInputComponent } from "../../../../../shared/common/components/search-input/search-input.component";
import { PageSearchConfiguration, SearchParams } from '../../../../../shared/models/Search';
import { pagesSearchConfiguration } from '../../../../../core/main/config/pagesStandardConfig';
import { UIItem } from '../../../../../shared/models/UI';
import { RouterModule } from '@angular/router';
import { SelectorComponent } from "../../../../../shared/common/components/selector/selector.component";

@Component({
    selector: 'app-movies-header',
    imports: [CommonModule, RouterModule, FontAwesomeModule, SearchInputComponent, SelectorComponent],
    templateUrl: './movies-header.component.html',
    styleUrl: './movies-header.component.css'
})
export class MoviesHeaderComponent {
    @Input() searchParams!: SearchParams;
    @Input() totalCount?: number = 0;
    @Input() isDeleteModeOn: boolean = false;
    @Output() searchParamsChanged = new EventEmitter<void>();
    @Output() deleteModeToggled = new EventEmitter<void>();
    @Output() onDeleteMovies = new EventEmitter<void>();

    searchConfig: PageSearchConfiguration = pagesSearchConfiguration.pagesConfig["/movies"];

    handleSearchTextChange(searchText: string): void {
        this.searchParams.searchText = searchText;
        this.searchParamsChanged.emit();
    }

    handleSortOptionChange(item: UIItem): void {
        this.searchParams.sortBy = item?.value;
        this.searchParamsChanged.emit();
    }

    handleToggleIsAscending(): void {
        this.searchParams.isAscending = !this.searchParams.isAscending;
        this.searchParamsChanged.emit();
    }

    handleToggleDeleteMode(): void {
        this.deleteModeToggled.emit();
    }

    deleteMovies(): void {
        this.onDeleteMovies.emit();
    }

    faPlus = faPlus;
    faArrowUpWideShort = faArrowUpWideShort;
    faArrowDownShortWide = faArrowDownShortWide;
    faTrash = faTrash;
    faCheck = faCheck;
}
