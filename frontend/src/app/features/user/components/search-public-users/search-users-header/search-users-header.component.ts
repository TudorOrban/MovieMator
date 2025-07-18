import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faArrowUpWideShort, faArrowDownShortWide, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SearchInputComponent } from "../../../../../shared/common/components/search-input/search-input.component";
import { PageSearchConfiguration, SearchParams } from '../../../../../shared/models/Search';
import { pagesSearchConfiguration } from '../../../../../core/main/config/pagesStandardConfig';
import { UIItem } from '../../../../../shared/models/UI';
import { RouterModule } from '@angular/router';
import { SelectorComponent } from "../../../../../shared/common/components/selector/selector.component";

@Component({
    selector: 'app-search-users-header',
    imports: [CommonModule, RouterModule, FontAwesomeModule, SearchInputComponent, SelectorComponent],
    templateUrl: './search-users-header.component.html',
    styleUrl: './search-users-header.component.css'
})
export class SearchUsersHeaderComponent {
    @Input() searchParams!: SearchParams;
    @Input() totalCount?: number = 0;
    @Output() searchParamsChanged = new EventEmitter<void>();
    @Output() sortOptionsChanged = new EventEmitter<void>();

    searchConfig: PageSearchConfiguration = pagesSearchConfiguration.pagesConfig["/users"];

    handleSearchTextChange(searchText: string): void {
        this.searchParams.searchText = searchText;
        this.searchParamsChanged.emit();
    }

    handleSortOptionChange(item: UIItem): void {
        this.searchParams.sortBy = item?.value;
        this.sortOptionsChanged.emit();
        this.searchParamsChanged.emit();
    }

    handleToggleIsAscending(): void {
        this.searchParams.isAscending = !this.searchParams.isAscending;
        this.searchParamsChanged.emit();
    }

    faPlus = faPlus;
    faArrowUpWideShort = faArrowUpWideShort;
    faArrowDownShortWide = faArrowDownShortWide;
    faCheck = faCheck;
    faTimes = faTimes;
}
